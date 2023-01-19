import { H1 } from "./typography.jsx";

import type { Component } from "solid-js";

const humanizeNumber = (number: number) => {
	if (number < 100) {
		return `${number}`;
	}

	const amountOfZeroes = Math.floor(Math.log10(number));

	if (amountOfZeroes < 4) {
		return `${Math.ceil(number / 100)} hundred`;
	}

	if (amountOfZeroes < 6) {
		return `${Math.ceil(number / 1000)} thousand`;
	}

	return `${Math.ceil(number / 1_000_000)} million`;
};

export const Hero: Component<{
	amount: number;
}> = (properties) => (
	<header class="mt-12">
		<H1>
			Holy guacamole, there are at least{" "}
			<mark class="whitespace-nowrap rounded-2xl bg-teal-50 px-3 py-2 text-teal-600">
				{humanizeNumber(properties.amount)}
			</mark>{" "}
			releases!
		</H1>
	</header>
);
