import { Releases } from "./releases.jsx";
import { Welcome } from "./welcome.jsx";
import { storageWithTTL } from "../utils/storage-with-ttl.js";
import { createSignal, Match, Switch } from "solid-js";

import type { Component } from "solid-js";

const [token, setToken] = createSignal(
	storageWithTTL.getItem<string>("token").data,
);

// @info: Spotify redirects to `#?access_token=...&expires_in=...` after the
//  user authenticates
const parameters = new URLSearchParams(location.hash.replace(/^#/, ""));
const tokenFromURL = parameters.get("access_token");
// @info: the `expires_in` parameter is in seconds
const ttl = Number(parameters.get("expires_in") ?? 0) * 1000;

if (tokenFromURL !== null && ttl > 0) {
	storageWithTTL.setItem("token", tokenFromURL, ttl);
	setToken(tokenFromURL);

	// @intent: replace the current URL with a clean one
	history.replaceState({}, document.title, "/");
}

export const Guard: Component = () => (
	<Switch fallback={<Welcome />}>
		<Match when={typeof token() === "string"}>
			<Releases />
		</Match>
	</Switch>
);
