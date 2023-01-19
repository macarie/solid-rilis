import { Container } from "./container.jsx";
import { OhSnap } from "./error.jsx";
import { Hero } from "./hero.jsx";
import { Loading } from "./loading.jsx";
import { Navbar } from "./navbar.jsx";
import { Release } from "./release.jsx";
import { token } from "../signals/token.js";
import {
	getFollowedArtists,
	getArtistsReleases,
	getMe,
} from "../utils/apis.js";
import {
	createResource,
	Match,
	Switch,
	createMemo,
	createSignal,
	For,
	onCleanup,
	onMount,
} from "solid-js";

import type { Component } from "solid-js";

const View: Component<{
	releases: Awaited<ReturnType<typeof getArtistsReleases>>;
}> = (properties) => {
	const [page, setPage] = createSignal(1);
	const pages = createMemo(() =>
		properties.releases.slice(
			0,
			Math.min(page() * 40, properties.releases.length),
		),
	);

	let pageEnd: HTMLDivElement;

	const intersectionObserver = new IntersectionObserver(
		(entries, observer) => {
			if (!entries.some((entry) => entry.isIntersecting)) {
				return;
			}

			if (page() === Math.ceil(properties.releases.length / 40)) {
				observer.disconnect();

				return;
			}

			setPage((page) => page + 1);
		},
		{
			root: null, // eslint-disable-line unicorn/no-null
			rootMargin: "30%",
		},
	);

	onMount(() => {
		intersectionObserver.observe(pageEnd);

		onCleanup(() => {
			intersectionObserver.disconnect();
		});
	});

	return (
		<>
			<Hero amount={properties.releases.length} />
			<section class="mt-24 mb-20 grid grid-cols-1 gap-12 xl:grid-cols-2">
				<For each={pages()}>{(release) => <Release release={release} />}</For>
				<div id="page-end-marker" ref={pageEnd!} />
			</section>
		</>
	);
};

export const Releases: Component = () => {
	const [me] = createResource(() => ({ token: token()! }), getMe);
	const [followedArtists, { refetch: refetchFollowedArtists }] = createResource(
		() => ({
			token: token()!,
		}),
		getFollowedArtists,
		{
			initialValue: [],
		},
	);
	const [progress, setProgress] = createSignal(0);
	const [releases, { refetch: refetchReleases }] = createResource(
		() => ({
			artists: followedArtists(),
			token: token()!,
			setProgress,
		}),
		getArtistsReleases,
		{
			initialValue: [],
		},
	);

	return (
		<>
			<Container>
				<Navbar user={me()} />
			</Container>
			<Switch
				fallback={
					<Loading text="Loading your 🖤 artists" total={1} progress={0} />
				}
			>
				<Match when={followedArtists.state === "ready"}>
					<Switch
						fallback={
							<Loading
								text="Loading your 🖤 artists' latest releases"
								total={followedArtists().length}
								progress={progress()}
							/>
						}
					>
						<Match when={releases.state === "ready"}>
							<Container>
								<View releases={releases()} />
							</Container>
						</Match>
						<Match when={releases.state === "errored"}>
							<OhSnap
								message="There was an issue while loading your 🖤 artists' latest releases."
								reset={refetchReleases}
							/>
						</Match>
					</Switch>
				</Match>
				<Match when={followedArtists.state === "errored"}>
					<OhSnap
						message="There was an issue while loading your 🖤 artists."
						reset={refetchFollowedArtists}
					/>
				</Match>
			</Switch>
		</>
	);
};
