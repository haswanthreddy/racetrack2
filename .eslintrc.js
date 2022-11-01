module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: 'airbnb-base',
	overrides: [
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		indent: [
			2,
			'tab',
			{
				SwitchCase: 1,
				VariableDeclarator: 1,
			},
		],
		'no-tabs': 0,
		'linebreak-style': 0,
	},
};
