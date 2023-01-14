import type { ParentComponent } from "solid-js";

export const H1: ParentComponent = (properties) => (
	<h1 class="text-4xl font-light text-black">{properties.children}</h1>
);

export const Paragraph: ParentComponent = (properties) => (
	<p class="text-lg font-light text-black">{properties.children}</p>
);

export const Text: ParentComponent = (properties) => (
	<span class="font-light">{properties.children}</span>
);

export const Strong: ParentComponent = (properties) => (
	<strong class="font-semibold">{properties.children}</strong>
);
