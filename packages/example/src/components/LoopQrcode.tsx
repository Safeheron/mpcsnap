import { Box, CircularProgress } from '@mui/material'
import { UR, UREncoder } from '@ngraveio/bc-ur'
import { QRCodeSVG } from 'qrcode.react'
import { FC, useEffect, useRef, useState } from 'react'

import useInterval from '@/hooks/useInterval'

interface Props {
  step: number
  message?: string
  encodings?: BufferEncoding
}

const LoopQrcode: FC<Props> = ({ step, message, encodings = 'utf-8' }) => {
  const [code, setCode] = useState('')
  const timer = useRef<any>()

  useEffect(() => {
    init()
    return () => clearInterval(timer.current)
  }, [step])

  const init = () => {
    if (!message) return

    const messageBuffer = Buffer.from(message, encodings)

    const ur = UR.fromBuffer(messageBuffer)
    const encoder = new UREncoder(ur, 400, 0, 10)

    clearInterval(timer.current)
    timer.current = setInterval(() => {
      const part = encoder.nextPart()
      displayPart(part)
    }, 300)
  }

  const displayPart = part => {
    setCode(part)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        marginRight: 2,
        position: 'relative',
      }}
    >
      {!code && (
        <Box
          sx={{
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.8)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <QRCodeSVG value={`${code}`} size={400} />
    </Box>
  )
}

export default LoopQrcode
