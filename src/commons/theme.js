import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#306998",
    },
    secondary: {
      main: "#FFD43B",
    },
  },
  typography: {
    fontFamily: "'Source Sans Pro', Arial, sans-serif",
  },
});

theme = responsiveFontSizes(theme);

export default theme;
