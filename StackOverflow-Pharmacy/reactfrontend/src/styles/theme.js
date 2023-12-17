import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#222222', // Black for app bar
    },
    secondary: {
      main: '#424242', // Dark gray for buttons
    },
    background: {
      default: '#f5f5f5', // Off-white background
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#757575', // Gray text
      custom: '#4caf50', // Custom color for Typography
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5', // Off-white background for the body
        },
      },
    },
  },
});

export default theme;
