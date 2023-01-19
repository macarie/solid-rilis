import { FullHeightContainer } from "./container.jsx";
import { H1, Strong } from "./typography.jsx";

import type { Component } from "solid-js";

export const Loading: Component<{
	text: string;
	progress: number;
	total: number;
}> = (properties) => (
	<FullHeightContainer>
		<div class="flex flex-col justify-center gap-7">
			<H1>{properties.text}</H1>
			<div class="flex flex-col gap-4">
				<div class="relative flex h-2 flex-nowrap">
					<div
						style={{
							transform: `scaleX(${properties.progress / properties.total})`,
						}}
						class="absolute h-full w-full origin-left bg-neutral-800 transition-transform duration-300 ease-in-out-cubic"
					/>
					<div
						style={{
							transform: `scaleX(${
								1 - properties.progress / properties.total
							})`,
						}}
						class="absolute h-full w-full origin-right bg-neutral-400 transition-transform duration-300 ease-in-out-cubic"
					/>
				</div>
				<span class="ml-auto">
					<Strong>{properties.progress}</Strong>/
					<Strong>{properties.total}</Strong>
				</span>
			</div>
		</div>
	</FullHeightContainer>
);
