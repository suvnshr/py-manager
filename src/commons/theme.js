import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
	palette: {
		primary: {
			main: '#6ba6d6',
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
