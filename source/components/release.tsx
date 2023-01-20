import { createMemo, For, Show } from "solid-js";

import type { getArtistsReleases } from "../utils/apis.js";
import type { Component, ParentComponent } from "solid-js";

const relativeTime = new Intl.RelativeTimeFormat(["en-US", "en"], {
	numeric: "auto",
	style: "long",
});

const getDaysPassedSince = (date: string) =>
	Math.ceil((Date.parse(date) - Date.now()) / 1000 / 60 / 60 / 24);

const Tag: ParentComponent = (properties) => (
	<div class="gap-1 rounded-lg bg-neutral-100 py-1 px-2 text-neutral-600">
		{properties.children}
	</div>
);

export const Release: Component<{
	release: Awaited<ReturnType<typeof getArtistsReleases>>[number];
}> = (properties) => {
	const relativeReleaseDateCopy = createMemo(() => {
		const relativeNumberOfDays = getDaysPassedSince(
			properties.release.release_date,
		);

		const relativeTimeSinceRelease = relativeTime.format(
			relativeNumberOfDays,
			"days",
		);

		if (relativeNumberOfDays > 1) {
			return `releasing in ${relativeTimeSinceRelease}`;
		}

		if (relativeNumberOfDays > 0) {
			return `releasing ${relativeTimeSinceRelease}`;
		}

		return `released ${relativeTimeSinceRelease}`;
	});

	return (
		<div class="flex gap-7">
			<a
				href={properties.release.external_urls.spotify}
				class="relative  h-32 w-32 shrink-0 rounded-lg md:h-36 md:w-36"
			>
				<img
					src={properties.release.images.at(0)?.url}
					alt={`Cover art for "${
						properties.release.name
					}" by ${properties.release.artists
						.map(({ name }) => name)
						.join(", ")}`}
					class="rounded-lg"
				/>
				<div
					style={{
						"background-image": `url('${
							properties.release.images.at(0)!.url
						}')`,
					}}
					class="absolute bottom-0 -z-10 h-full w-full origin-bottom scale-[.8] bg-contain blur-md"
				/>
			</a>
			<div class="flex min-w-0 flex-col gap-1">
				<h1 class="overflow-hidden text-ellipsis whitespace-nowrap text-2xl">
					<a href={properties.release.external_urls.spotify} class="">
						{properties.release.name}
					</a>
				</h1>
				<h2 class="overflow-hidden text-ellipsis whitespace-nowrap text-xl">
					<For each={properties.release.artists}>
						{(artist) => (
							<>
								<a href={artist.external_urls.spotify}>{artist.name}</a>
								<Show when={artist !== properties.release.artists.at(-1)}>
									,&nbsp;
								</Show>
							</>
						)}
					</For>
				</h2>
				<div class="mt-auto flex gap-2">
					<Tag>{relativeReleaseDateCopy()}</Tag>
					<Tag>{properties.release.album_type}</Tag>
				</div>
			</div>
		</div>
	);
};
