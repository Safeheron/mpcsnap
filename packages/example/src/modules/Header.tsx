import { Button, Grid } from '@mui/material'

interface Props {
  connected: boolean
  onConnect: () => void
}

const Header = ({ connected, onConnect }) => {
  return (
    <Grid
      container
      direction={'row'}
      justifyContent="space-between"
      alignItems="center"
    >
      <div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>MPCSnap</div>
        <div style={{ fontSize: '14px' }}>
          MPCSnap enables MPC Wallet inside MetaMask
        </div>
      </div>
      <Button
        disabled={connected}
        variant={'contained'}
        color={'primary'}
        onClick={onConnect}
      >
        {connected ? 'Connected' : 'Connect Metamask Flask'}
      </Button>
    </Grid>
  )
}

export default Header
