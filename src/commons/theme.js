import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export default responsiveFontSizes(
	createTheme({
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
			mode: 'dark',
		},
		typography: {
			fontFamily: "'Source Sans Pro', Arial, sans-serif",
		},
	}),
);
