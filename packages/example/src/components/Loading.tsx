import { Backdrop, CircularProgress } from '@mui/material'
import { FC } from 'react'

interface Props {
  loading: boolean
  text?: string
}

const Loading: FC<Props> = ({ loading, text }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',

        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={loading}
    >
      {text}
      <CircularProgress color="inherit" sx={{ marginTop: 2 }} />
    </Backdrop>
  )
}

export default Loading
