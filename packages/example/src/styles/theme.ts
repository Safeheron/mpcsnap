import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#12B89A',
    },
  },
  typography: {
    fontSize: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          color: 'white',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          whiteSpace: 'nowrap',
        },
      },
    },
  },
})
