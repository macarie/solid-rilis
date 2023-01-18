import { H1, Paragraph, Text } from "./typography.jsx";

import type { Component } from "solid-js";

export const OhSnap: Component<{ message: string; reset: () => void }> = (
	properties,
) => (
	<div class="flex grow flex-col justify-center gap-7 px-8 pb-36 md:px-16 lg:px-36">
		<H1>Oh, snap!</H1>
		<div class="flex flex-col gap-10 px-4 md:px-12">
			<Paragraph>{properties.message}</Paragraph>
			<div>
				<button
					onClick={() => {
						properties.reset();
					}}
					class="rounded-full border-2 border-black bg-black px-4 py-2 text-white transition-colors duration-300 ease-in-out-cubic hover:bg-white hover:text-black"
				>
					<Text>Try again</Text>
				</button>
			</div>
		</div>
	</div>
);
