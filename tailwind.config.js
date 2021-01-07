module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
	},
	purge: [],
	prefix: '',
	important: false,
	separator: ':',
	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',

			black: '#000',
			white: '#fff',

			blue: {
				main: '#196cbf',
				dark: '#125699',
			},
		},
	},
	corePlugins: {},
	plugins: [],
};
