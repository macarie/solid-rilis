import { H1, Paragraph, Strong, Text } from "./typography.jsx";
import { environment } from "../environment.js";

import type { Component } from "solid-js";

export const Welcome: Component = () => (
	<div class="flex grow flex-col justify-center gap-6 px-8 md:px-16 lg:px-36">
		<H1>What&rsquo;s the craic?</H1>
		<div class="flex flex-col gap-10 px-4 md:px-12">
			<Paragraph>
				To see the latest releases of your 🖤 artists you need to sign in using{" "}
				<span class="text-[#1db954]">
					<Strong>Spotify</Strong>
				</span>
				.
			</Paragraph>
			<a
				class="w-max rounded-full border-2 border-black bg-black px-4 py-2 text-white transition-colors duration-300 ease-in-out-cubic hover:bg-white hover:text-black"
				href={`https://accounts.spotify.com/authorize?client_id=${environment.VITE_SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${environment.VITE_SPOTIFY_REDIRECT_URI}&scope=user-follow-read&show_dialog=false`}
			>
				<Text>
					Sign in with <Strong>Spotify</Strong>
				</Text>
			</a>
		</div>
	</div>
);
