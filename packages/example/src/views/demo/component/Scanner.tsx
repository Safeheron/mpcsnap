import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  TextField,
} from '@mui/material'
import { UR, URDecoder, UREncoder } from '@ngraveio/bc-ur'
import { BrowserQRCodeReader } from '@zxing/browser'
import { IScannerControls } from '@zxing/browser/esm/common/IScannerControls'
import { QRCodeSVG } from 'qrcode.react'
import React, { useEffect, useRef, useState } from 'react'

const codeReader = new BrowserQRCodeReader()

const Scanner: React.FC = () => {
  const [inputDeviceId, setInputDeviceId] = useState('')
  const [progress, setProgress] = useState<number>(0)
  const previewEle = useRef<HTMLVideoElement>(null)
  const cameraControls = useRef<IScannerControls>()

  const [decodedStr, setDecodedStr] = useState('')

  const resetCamera = () => {
    setProgress(0)
    cameraControls.current?.stop()
  }

  const scanQrCode = async () => {
    if (!previewEle.current) {
      return
    }
    setProgress(0)
    setDecodedStr('')
    const decoder = new URDecoder()
    cameraControls.current = await codeReader.decodeFromVideoDevice(
      inputDeviceId,
      previewEle.current,
      (result, error) => {
        const percent = decoder.getProgress()
        if (percent > progress) {
          setProgress(percent)
        }

        if (!decoder.isComplete()) {
          if (result?.getText()) {
            decoder.receivePart(result?.getText() as string)
          }
          return
        }

        if (decoder.isSuccess()) {
          const ur = decoder.resultUR()
          const decoded = ur.decodeCBOR()
          setDecodedStr(decoded.toString())
          resetCamera()
        } else {
          const decodedErrors = decoder.resultError()
          console.log(decodedErrors)
          resetCamera()
        }
      }
    )
  }

  // ----------- generate qrcode --------------
  const timer = useRef<any>()
  const [code, setCode] = useState('')
  const [strForQrCode, setStrForQrCode] = useState('')
  const generateQrCode = () => {
    if (!strForQrCode) return
    // @ts-ignore
    const messageBuffer = Buffer.from(strForQrCode)

    const ur = UR.fromBuffer(messageBuffer)
    const fragmentsLen = Math.ceil(messageBuffer.length / 10) + 1
    const maxFragmentLength = fragmentsLen > 300 ? 300 : fragmentsLen
    const minFragmentLength = 1
    const encoder = new UREncoder(ur, maxFragmentLength, 0, minFragmentLength)

    clearInterval(timer.current)
    timer.current = setInterval(() => {
      const part = encoder.nextPart()
      displayPart(part)
    }, 300)
  }

  const displayPart = part => {
    setCode(part)
  }

  const stopQrcode = () => {
    clearInterval(timer.current)
  }

  useEffect(() => {
    BrowserQRCodeReader.listVideoInputDevices().then(videoInputDevices => {
      setInputDeviceId(videoInputDevices[0].deviceId)
    })
    return () => {
      resetCamera()
      clearInterval(timer.current)
    }
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card>
          <CardActionArea>
            <video
              ref={previewEle}
              id="videoRef"
              width="300"
              height="200"
              style={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}
            />
            {progress > 0 && progress < 1 && (
              <div>Progress: {(progress * 100).toFixed(0)}%</div>
            )}
          </CardActionArea>
          <CardContent>
            <TextField
              variant={'filled'}
              multiline
              placeholder={'input text attempt generate dynamic code'}
              rows={4}
              fullWidth
              value={decodedStr}
            />
          </CardContent>
          <CardActions>
            <Button variant={'contained'} onClick={scanQrCode}>
              Open
            </Button>
            <Divider orientation="vertical" />
            <Button variant={'outlined'} onClick={resetCamera}>
              Close
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardActionArea>
            <QRCodeSVG value={`${code}`} size={200} />
          </CardActionArea>
          <CardContent>
            <TextField
              multiline
              variant={'outlined'}
              placeholder={'input text attempt generate dynamic code'}
              rows={4}
              fullWidth
              onChange={e => setStrForQrCode(e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button
              color="primary"
              variant={'contained'}
              onClick={generateQrCode}
            >
              generate qr code
            </Button>
            <Button color="primary" variant={'outlined'} onClick={stopQrcode}>
              Stop
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Scanner
