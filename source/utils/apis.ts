import { fetchUntil } from "./fetch-until.js";
import { z } from "zod";

import type { Options } from "ky";
import type { Setter } from "solid-js";

export const createKyOptions = (token: string): Options => ({
	headers: {
		Authorization: `Bearer ${token}`,
	},
	retry: {
		limit: 5,
		// @info: 404s and 503s are random, maybe a temporary bug Spotify has
		statusCodes: [404, 429, 503],
	},
	// @info: it might happen to reach the rate limit and retry-after becomes
	//  large real quick, we don't need a timeout
	timeout: false,
});

const baseURL = "https://api.spotify.com/v1";

const getMeEndpoint = () => `${baseURL}/me`;

const getFollowingArtistsEndpoint = () =>
	`${baseURL}/me/following?type=artist&limit=50`;

const getArtistAlbumsEndpoints = (artist: string) => {
	const baseParameters = new URLSearchParams({
		country: "from_token",
		limit: "50",
	}).toString();

	const baseArtistURL = `${baseURL}/artists/${artist}/albums`;

	return [
		`${baseArtistURL}?${baseParameters}&include_groups=album`,
		`${baseArtistURL}?${baseParameters}&include_groups=single`,
	];
};

const meSchema = z.object({
	display_name: z.string(),
	external_urls: z.object({
		spotify: z.string().url(),
	}),
	images: z.array(
		z.object({
			url: z.string().url(),
		}),
	),
	uri: z.string(),
});

const followingArtistsSchema = z.object({
	artists: z.object({
		items: z.array(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		),
		next: z.string().url().nullable(),
		total: z.number(),
	}),
});

const groups = z.union([
	z.literal("album"),
	z.literal("single"),
	z.literal("appears_on"),
	z.literal("compilation"),
]);

const artistAlbumsSchema = z.object({
	items: z.array(
		z.object({
			album_group: groups,
			album_type: groups,
			artists: z.array(
				z.object({
					external_urls: z.object({
						spotify: z.string().url(),
					}),
					id: z.string(),
					name: z.string(),
					uri: z.string(),
				}),
			),
			external_urls: z.object({
				spotify: z.string().url(),
			}),
			id: z.string(),
			images: z.array(
				z.object({
					url: z.string().url(),
				}),
			),
			name: z.string(),
			release_date: z.string(),
			total_tracks: z.number(),
			uri: z.string(),
		}),
	),
	next: z.string().url().nullable(),
});

export const getMe = async ({ token }: { token: string }) => {
	const response = await fetchUntil({
		endpoint: getMeEndpoint(),
		getNextEndpoint: () => null, // eslint-disable-line unicorn/no-null
		kyOptions: createKyOptions(token),
		schema: meSchema,
	});

	// @info: if we have a token, the user is logged in and the `/me` endpoint
	//  has data
	return response.at(0)!;
};

export const getFollowedArtists = async ({ token }: { token: string }) => {
	const followingArtistsResponses = await fetchUntil({
		endpoint: getFollowingArtistsEndpoint(),
		getNextEndpoint: (data) => data.artists.next,
		kyOptions: createKyOptions(token),
		schema: followingArtistsSchema,
	});

	return followingArtistsResponses.flatMap(({ artists: { items } }) => items);
};

const msInOneYear = 365 * 24 * 60 * 60 * 1000;
const lastYear = new Date(Date.now() - msInOneYear)
	.toISOString()
	.split("T")
	.at(0)!;
const isReleaseFromLastYear = (
	release: z.infer<typeof artistAlbumsSchema>["items"][number],
) => lastYear.localeCompare(release.release_date) <= 0;

export const getArtistsReleases = async ({
	artists,
	token,
	setProgress,
}: {
	artists: Awaited<ReturnType<typeof getFollowedArtists>>;
	token: string;
	setProgress: Setter<number>;
}) => {
	const artistsReleasesResponses = await Promise.all(
		artists.flatMap(async ({ id }) => {
			const albumsAndSingles = await Promise.all(
				getArtistAlbumsEndpoints(id).map(async (endpoint) =>
					fetchUntil({
						endpoint,
						// @intent: return the next page only if the last release is not more
						//  than one year old
						getNextEndpoint: (albums) =>
							albums.items.length > 0 &&
							isReleaseFromLastYear(albums.items.at(-1)!)
								? albums.next
								: null, // eslint-disable-line unicorn/no-null
						kyOptions: createKyOptions(token),
						schema: artistAlbumsSchema,
					}),
				),
			);

			setProgress((counter) => counter + 1);

			return albumsAndSingles;
		}),
	);

	setProgress(0);

	return artistsReleasesResponses
		.flatMap((albumsAndSingles) =>
			albumsAndSingles.flatMap((releases) =>
				releases.flatMap(({ items }) =>
					items.filter((release) => isReleaseFromLastYear(release)),
				),
			),
		)
		.sort((a, b) => {
			const dateComparison = b.release_date.localeCompare(a.release_date);

			if (dateComparison === 0) return a.name.localeCompare(b.name);

			return dateComparison;
		});
};
