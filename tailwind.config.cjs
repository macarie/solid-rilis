/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["index.html", "./source/**/*.{ts,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Inter var", "sans-serif"],
		},
		extend: {
			transitionTimingFunction: {
				"in-out-cubic": "cubic-bezier(0.65, 0.05, 0.36, 1)",
			},
		},
	},
	plugins: [],
};
