import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DKGP1, DKGP2 } from '@safeheron/two-party-mpc-adapter'
import React, { useState } from 'react'

const dkg1 = new DKGP1()
const dkg2 = new DKGP2()

const Create: React.FC = () => {
  const [priv1, setPriv1] = useState('')
  const [pub1, setPub1] = useState('')

  const [priv2, setPriv2] = useState('')
  const [pub2, setPub2] = useState('')

  const handleCreateP1 = async () => {
    const { priv, pub } = await dkg1.createContext()
    setPriv1(priv)
    setPub1(pub)
  }

  const handleCreateP2 = async () => {
    const { priv, pub } = await dkg2.createContext()
    setPriv2(priv)
    setPub2(pub)
  }

  const [pub2OfInput, setPub2OfInput] = useState('')
  const [message1, setMessage1] = useState('')
  const handleStep1Ofp1 = async () => {
    const message1Result = await dkg1.step1(pub2OfInput)
    setMessage1(message1Result)
  }

  const [message1Input, setMessage1Input] = useState('')
  const [pub1Input, setPub1Input] = useState('')
  const [message2, setMessage2] = useState('')
  const handleStep1Ofp2 = async () => {
    const message2Result = await dkg2.step1(message1Input, pub1Input)
    setMessage2(message2Result)
  }

  const [message2OfInput, setMessage2OfInput] = useState('')
  const [message3, setMessage3] = useState('')
  const handleStep2Ofp1 = async () => {
    const message3Result = await dkg1.step2(message2OfInput)
    setMessage3(message3Result)
  }

  const [message3OfInput, setMessage3OfInput] = useState('')
  const [doneMessage, setDoneMessage] = useState('')
  const handleStep2Ofp2 = async () => {
    const doneMessageResult = await dkg2.step2(message3OfInput)
    setDoneMessage(doneMessageResult)
  }

  const [doneMessageOfInput, setDoneMessageOfInput] = useState('')
  const [keyshare1, setKeyshare1] = useState('')
  const handleStep3OfP1 = () => {
    const keyshare1Result = dkg1.step3(doneMessageOfInput)
    setKeyshare1(JSON.stringify(keyshare1Result))
  }

  const [keyshare2, setKeyshare2] = useState('')
  const handleExportKeyshare2 = () => {
    const keyshare2Object = dkg2.exportKeyShare2()
    setKeyshare2(JSON.stringify(keyshare2Object))
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
        <h3>Snap</h3>
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Create P1context
            </Typography>
            <Typography variant="body2" color="text.secondary">
              priv: {priv1}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              pub: {pub1}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleCreateP1}>
              execute p1
            </Button>
          </CardActions>
        </Card>
        <br />
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Step1 of p1
            </Typography>
            <TextField
              fullWidth
              label="publicKey of p2"
              onChange={e => setPub2OfInput(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <Alert severity="info">
              <AlertTitle>message1</AlertTitle>
              {message1}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleStep1Ofp1}>
              excute step1
            </Button>
          </CardActions>
        </Card>
        <br />
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Step2 of p1
            </Typography>
            <TextField
              fullWidth
              onChange={e => setMessage2OfInput(e.target.value)}
              label="message2 of p2"
              variant="outlined"
              margin="normal"
            />
            <Alert severity="info">
              <AlertTitle>message3</AlertTitle>
              {message3}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleStep2Ofp1}>
              excute step2
            </Button>
          </CardActions>
        </Card>
        <br />
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Step3 of p1
            </Typography>
            <TextField
              fullWidth
              label="doneMessage of p2"
              onChange={e => setDoneMessageOfInput(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <Alert severity="info">
              <AlertTitle>keyshare1</AlertTitle>
              {keyshare1}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleStep3OfP1}>
              excute step3
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={6} md={6}>
        <h3>Keystone</h3>
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Create P2context
            </Typography>
            <Typography variant="body2" color="text.secondary">
              priv: {priv2}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              pub: {pub2}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleCreateP2}>
              execute p2
            </Button>
          </CardActions>
        </Card>

        <br />
        <br />
        <br />
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Step1 of p2
            </Typography>
            <TextField
              fullWidth
              label="message1 of p1"
              onChange={e => setMessage1Input(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="pub1 of p1"
              onChange={e => setPub1Input(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <Alert severity="info">
              <AlertTitle>message2</AlertTitle>
              {message2}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleStep1Ofp2}>
              excute step1
            </Button>
          </CardActions>
        </Card>

        <br />
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Step2 of p2
            </Typography>
            <TextField
              fullWidth
              label="message3 of p1"
              onChange={e => setMessage3OfInput(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <Alert severity="info">
              <AlertTitle>doneMessage</AlertTitle>
              {doneMessage}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleStep2Ofp2}>
              excute step2
            </Button>
          </CardActions>
        </Card>

        <br />
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              export keyshare2
            </Typography>
            <Alert severity="info">
              <AlertTitle>keyshare2</AlertTitle>
              {keyshare2}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleExportKeyshare2}>
              Export keyshare2
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Create
