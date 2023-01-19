import type { ParentComponent } from "solid-js";

export const Container: ParentComponent = (properties) => (
	<div class="mx-auto w-full max-w-screen-2xl px-8 md:px-16">
		{properties.children}
	</div>
);

export const FullHeightContainer: ParentComponent = (properties) => (
	<div class="mx-auto flex w-full max-w-screen-2xl grow flex-col justify-center px-8 pb-36 md:px-16">
		{properties.children}
	</div>
);
