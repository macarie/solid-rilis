import defaultAvatar from "../assets/images/default-avatar.svg";

import type { getMe } from "../utils/apis.js";
import type { Component } from "solid-js";

export const Navbar: Component<{
	user?: Awaited<ReturnType<typeof getMe>>;
}> = (properties) => (
	<nav class="flex items-center justify-between py-4">
		<a href="/" class="text-2xl font-light">
			rilis.
		</a>
		<a href="/" class="flex items-center gap-4 text-xl font-light">
			{properties.user?.display_name ?? "Loading"}
			<img
				src={properties.user?.images.at(0)?.url ?? defaultAvatar}
				class="w-11 rounded-lg"
				alt={
					properties.user === undefined
						? "Generic avatar"
						: `${properties.user.display_name}'s profile avatar`
				}
			/>
		</a>
	</nav>
);
