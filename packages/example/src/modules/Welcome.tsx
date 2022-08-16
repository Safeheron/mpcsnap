import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

import { isMetaMaskSnapsSupported } from '@/utils'

const flaskLinkUrl = 'https://metamask.io/flask/'

const Welcome = () => {
  const [flaskIsInstall, setFlaskIsInstall] = useState(true)

  const detectFlask = async () => {
    const supportSnap = await isMetaMaskSnapsSupported()
    setFlaskIsInstall(supportSnap)
  }

  useEffect(() => {
    detectFlask()
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10,
      }}
    >
      <img src="../assets/welcome.png" width="100%" />
      {!flaskIsInstall && (
        <p>
          Please ensure you have MetaMask Flask Installed for this example,
          Click
          <a target={'_blank'} href={flaskLinkUrl}>
            {' '}
            here
          </a>{' '}
          to install
        </p>
      )}
    </Box>
  )
}

export default Welcome
