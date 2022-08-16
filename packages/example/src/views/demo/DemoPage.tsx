import { Container } from '@mui/material'
import React from 'react'

import Create from '@/views/demo/component/Create'
import Scanner from '@/views/demo/component/Scanner'
import Sign from '@/views/demo/component/Sign'

const DemoPage = () => {
  return (
    <Container fixed>
      <Scanner />
      <br />
      <h2>Create Wallet</h2>
      <Create />
      <br />
      <h2>Signing</h2>
      <Sign />
    </Container>
  )
}

export default DemoPage
