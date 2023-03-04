import type { ParentComponent } from "solid-js";

export const H1: ParentComponent = (props) => (
	<h1 class="text-4xl font-light text-black">{props.children}</h1>
);

export const Paragraph: ParentComponent = (props) => (
	<p class="text-lg font-light text-black">{props.children}</p>
);

export const Text: ParentComponent = (props) => (
	<span class="font-light">{props.children}</span>
);

export const Strong: ParentComponent = (props) => (
	<strong class="font-semibold">{props.children}</strong>
);
