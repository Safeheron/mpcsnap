import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import React, { useRef, useState } from 'react'
import { SignerP1, SignerP2 } from '@safeheron/two-party-mpc-adapter'

const Sign = () => {
  const [txObject, setTxObject] = useState('')

  const signP1Ref = useRef<SignerP1>()
  const signP2Ref = useRef<SignerP2>()

  const [priv1, setPriv1] = useState('')
  const [pub1, setPub1] = useState('')
  const [keyshare1, setKeyshare1] = useState('')

  const [priv2, setPriv2] = useState('')
  const [pub2, setPub2] = useState('')
  const [keyshare2, setKeyshare2] = useState('')

  const handleCreateSignP1 = async () => {
    signP1Ref.current = new SignerP1(keyshare1, priv1, pub2)
  }

  const handleCreateSignP2 = async () => {
    signP2Ref.current = new SignerP2(keyshare2, priv2, pub1)
  }

  const [message1, setMessage1] = useState('')
  const handleStep1Ofp1 = async () => {
    await signP1Ref.current!.createContext(JSON.parse(txObject))
    const message1Result = await signP1Ref.current!.step1()
    setMessage1(message1Result)
  }

  const [message1OfInput, setMessage1OfInput] = useState('')
  const [message2, setMessage2] = useState('')
  const handleStep1Ofp2 = async () => {
    const message2Result = await signP2Ref.current!.step1(
      JSON.parse(txObject),
      message1OfInput
    )
    setMessage2(message2Result)
  }

  const [message2OfInput, setMessage2OfInput] = useState('')
  const [message3, setMessage3] = useState('')
  const handleStep2Ofp1 = async () => {
    const message3Result = await signP1Ref.current!.step2(message2OfInput)
    setMessage3(message3Result)
  }

  const [message3OfInput, setMessage3OfInput] = useState('')
  const [message4, setMessage4] = useState('')
  const handleStep2Ofp2 = async () => {
    const message4Result = await signP2Ref.current!.step2(message3OfInput)
    setMessage4(message4Result)
  }

  const [message4OfInput, setMessage4OfInput] = useState('')
  const [rawTransaction, setRawTransaction] = useState('')
  const handleStep3Ofp1 = async () => {
    await signP1Ref.current!.step3(message4OfInput)
    const rawTx = signP1Ref.current!.exportRawTx()
    setRawTransaction(rawTx)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <TextField
          fullWidth
          label="tx object"
          onChange={e => setTxObject(e.target.value)}
          variant="outlined"
          margin="normal"
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <h3>Snap</h3>

        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Create SignP1 Instance
            </Typography>
            <TextField
              fullWidth
              label="local auth priv1"
              onChange={e => setPriv1(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="remote auth pub2"
              onChange={e => setPub2(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="keyshare1"
              onChange={e => setKeyshare1(e.target.value)}
              variant="outlined"
            />
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleCreateSignP1}>
              Create Sign P1
            </Button>
          </CardActions>
        </Card>

        <br />

        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Step1 of p1
            </Typography>
            <Alert severity="info">
              <AlertTitle>message1</AlertTitle>
              {message1}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleStep1Ofp1}>
              execute step1
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
              label="message2 of p2"
              onChange={e => setMessage2OfInput(e.target.value)}
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
              execute step2
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
              label="message4 of p2"
              onChange={e => setMessage4OfInput(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <Alert severity="info">
              <AlertTitle>rawTransaction</AlertTitle>
              {rawTransaction}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleStep3Ofp1}>
              execute step3
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={6} md={6}>
        <h3>Keystone</h3>
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Create SignP2 Instance
            </Typography>
            <TextField
              fullWidth
              label="local auth priv2"
              onChange={e => setPriv2(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="remote auth pub1"
              onChange={e => setPub1(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="keyshare2"
              onChange={e => setKeyshare2(e.target.value)}
              variant="outlined"
            />
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleCreateSignP2}>
              Create Sign P2
            </Button>
          </CardActions>
        </Card>

        <br />
        <Card variant={'outlined'}>
          <CardContent>
            <Typography variant="h5" component="div">
              Step1 of p2
            </Typography>
            <TextField
              fullWidth
              label="message1 of p1"
              onChange={e => setMessage1OfInput(e.target.value)}
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
              execute step1
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
              <AlertTitle>message4</AlertTitle>
              {message4}
            </Alert>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleStep2Ofp2}>
              execute step2
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Sign
