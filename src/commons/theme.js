import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import {blue} from "@mui/material/colors";

export default responsiveFontSizes(
	createTheme({
		palette: {
			primary: {
				// 306998
				// #4B8BBE
				main: '#6ba6d6',
				// main: '#4B8BBE',
			},
			secondary: {
				main: '#FFD43B',
			},
			mode: 'dark',
		},
		typography: {
			fontFamily: "'DM Sans', sans-serif",
			h1: {
				fontFamily: "'Space Mono', monospace",
			},
			h2: {
				fontFamily: "'Space Mono', monospace",
			},
			h3: {
				fontFamily: "'Space Mono', monospace",
			},
			h4: {
				fontFamily: "'Space Mono', monospace",
			},
			h5: {
				fontFamily: "'Space Mono', monospace",
			},
		},
	}),
);
