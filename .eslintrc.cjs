/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	reportUnusedDisableDirectives: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["tsconfig.cjs.json", "tsconfig.vite.json", "tsconfig.json"],
	},
	plugins: ["prettier", "solid"],
	extends: [
		"xo",
		"xo-typescript",
		"plugin:import/recommended",
		"plugin:unicorn/recommended",
		"plugin:jsx-a11y/recommended",
		"plugin:solid/typescript",
		"plugin:prettier/recommended",
	],
	rules: {
		"prettier/prettier": [
			"error",
			{
				useTabs: true,
				trailingComma: "all",
			},
		],
		"unicorn/prefer-at": [
			"error",
			{
				checkAllIndexAccess: true,
			},
		],
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{
				prefer: "type-imports",
			},
		],
		"@typescript-eslint/naming-convention": "off",
		"import/no-unresolved": "off",
		"import/order": [
			"error",
			{
				alphabetize: {
					caseInsensitive: true,
					order: "asc",
				},
				groups: [
					[
						"builtin",
						"external",
						"internal",
						"unknown",
						"parent",
						"sibling",
						"index",
						"object",
					],
					"type",
				],
				"newlines-between": "always",
			},
		],
	},
};
