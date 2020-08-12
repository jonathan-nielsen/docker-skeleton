module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	env: {
		browser: false,
		node: true,
	},
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		semi: [2, 'never'],
		indent: ['error', 'tab', { "SwitchCase": 1 }],
		'comma-dangle': ['error', {
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'never',
			exports: 'never',
			functions: 'never',
		}],
		'no-console': 2,
		'no-tabs': 0,
	},
}