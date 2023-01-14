/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["index.html", "./source/**/*.{ts,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Inter var", "sans-serif"],
		},
		extend: {},
	},
	plugins: [],
};
