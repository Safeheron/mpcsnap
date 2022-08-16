import { Backdrop, Box, Button, Grid } from '@mui/material'
import { useState } from 'react'

import Loading from '@/components/Loading'
import { useAlert } from '@/hooks'
import { createWalletContext } from '@/service/metamask'

const CreateOrImportGuide = ({
  onCreate,
  onImport,
  startHeartBeat,
  stopHeartBeat,
}) => {
  const [loading, setLoding] = useState(false)
  const alert = useAlert()

  const handleCreate = async () => {
    startHeartBeat()
    setLoding(true)
    const res = await createWalletContext()
    setLoding(false)
    if (res?.success) {
      onCreate()
    } else {
      alert(res.errMsg)
      stopHeartBeat()
    }
  }

  return (
    <Backdrop
      sx={{
        bgcolor: 'rgba(255,255,255,0.7)',
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
      open={true}
    >
      <Loading loading={loading} text="Creating...(～30 seconds)" />
      <Grid
        container
        justifyContent={'center'}
        direction={'row'}
        alignItems={'center'}
      >
        <Button variant={'contained'} onClick={handleCreate}>
          Create MPC Wallet
        </Button>
        <Box mx={'20px'} />
        <Button variant={'contained'} onClick={onImport}>
          Import MPC Wallet
        </Button>
      </Grid>
    </Backdrop>
  )
}

export default CreateOrImportGuide
