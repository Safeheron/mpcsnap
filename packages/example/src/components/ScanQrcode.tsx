import { Box } from '@mui/material'
import { URDecoder } from '@ngraveio/bc-ur'
import { BarcodeFormat, BrowserQRCodeReader } from '@zxing/browser'
import { IScannerControls } from '@zxing/browser/esm/common/IScannerControls'
import { FC, useEffect, useRef, useState } from 'react'

const codeReader = new BrowserQRCodeReader()

interface Props {
  step: number
  onComplete: (msg: any) => void
}

const ScanQrcode: FC<Props> = ({ step, onComplete }) => {
  const [inputDeviceId, setInputDeviceId] = useState('')
  const [progress, setProgress] = useState<number>(0)
  const previewEle = useRef<HTMLVideoElement>(null)
  const cameraControls = useRef<IScannerControls>()

  useEffect(() => {
    BrowserQRCodeReader.listVideoInputDevices().then(videoInputDevices => {
      setInputDeviceId(videoInputDevices[0].deviceId)
    })
    scanQrCode()
    return () => {
      resetCamera()
    }
  }, [])

  useEffect(() => {
    setProgress(0)
  }, [step])

  const scanQrCode = async () => {
    if (!previewEle.current) {
      return
    }
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
          onComplete(decoded.toString())
          resetCamera()
        } else {
          const decodedErrors = decoder.resultError()
          console.log('decode error====', decodedErrors)
          resetCamera()
        }
      }
    )
  }

  const resetCamera = () => {
    cameraControls.current?.stop()
  }

  return (
    <Box>
      <video
        ref={previewEle}
        id="videoRef"
        width="430"
        height="400"
        style={{
          border: '1px solid rgba(0, 0, 0, 0.12)',
          filter: 'blur(12px)',
        }}
      />
      {progress > 0 && progress < 1 && (
        <div>Progress: {(progress * 100).toFixed(0)}%</div>
      )}
    </Box>
  )
}

export default ScanQrcode
