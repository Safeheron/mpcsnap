import '@/styles/common.less'

import { ThemeProvider } from '@mui/material'
import { theme } from '@styles/theme'
import { SnackbarProvider } from 'notistack'
import ReactDom from 'react-dom'

import App from '@/App'

ReactDom.render(
  <ThemeProvider theme={theme}>
    {/*
      // @ts-ignore */}
    <SnackbarProvider
      autoHideDuration={1800}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <App />
    </SnackbarProvider>
  </ThemeProvider>,
  document.getElementById('root')
)
