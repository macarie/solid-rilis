import { FullHeightContainer } from "./container.jsx";
import { H1, Paragraph, Text } from "./typography.jsx";

import type { Component } from "solid-js";

export const OhSnap: Component<{ message: string; reset: () => void }> = (
	props,
) => (
	<FullHeightContainer>
		<div class="flex flex-col justify-center gap-7">
			<H1>Oh, snap!</H1>
			<div class="flex flex-col gap-10 px-4 md:px-12">
				<Paragraph>{props.message}</Paragraph>
				<div>
					<button
						onClick={() => {
							props.reset();
						}}
						class="rounded-full border-2 border-black bg-black px-4 py-2 text-white transition-colors duration-300 ease-in-out-cubic hover:bg-white hover:text-black"
					>
						<Text>Try again</Text>
					</button>
				</div>
			</div>
		</div>
	</FullHeightContainer>
);
