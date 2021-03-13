import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
	palette: {
		primary: {
			// 306998
			// #4B8BBE
			// main: '#6ba6d6',
			main: '#4B8BBE',
		},
		secondary: {
			main: '#FFD43B',
		},
		type: 'dark',
	},
	typography: {
		fontFamily: "'Source Sans Pro', Arial, sans-serif",
	},
});

let customTheme = responsiveFontSizes(theme);

export default customTheme;
