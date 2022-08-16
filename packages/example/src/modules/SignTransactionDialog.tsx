import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { FC, useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import LoopQrcode from '@/components/LoopQrcode'
import ScanQrcode from '@/components/ScanQrcode'
import { useAlert } from '@/hooks'
import { signTransactionStep1, signTransactionStep2 } from '@/service/metamask'
import { SignQrcode1 } from '@/service/models'

interface Props {
  qrcode1: SignQrcode1
  onClose: () => void
  onComplete: (raw: string) => void
}
const SignTransactionDialog: FC<Props> = ({ qrcode1, onClose, onComplete }) => {
  const [loading, setLoading] = useState(false)
  const [message3, setMessage3] = useState<string>('')
  const [step, setStep] = useState(1)

  const alert = useAlert()

  const step1 = async (message2: string) => {
    console.log('step1 end')

    console.log('message1', qrcode1.message1)

    setLoading(true)
    const res = await signTransactionStep1(message2)
    setLoading(false)
    console.log(res)

    if (res.success && res.message3) {
      setMessage3(res.message3)
      setStep(2)
    } else {
      onClose()
      alert(res.errMsg)
    }
  }

  const step2 = async (message4: string) => {
    console.log('step2 end')

    console.log('message3', message3)

    setLoading(true)
    const res = await signTransactionStep2(message4)
    console.log(res)
    setLoading(false)
    if (res.success) {
      onComplete(`${res.signedRawTransaction}`)
    } else {
      onClose()
      alert(res.errMsg)
    }
  }

  return (
    <Dialog open={true} maxWidth={'md'}>
      <Loading loading={loading} />
      <DialogTitle>
        Step{' '}
        <span style={{ fontSize: 30, fontWeight: 'bold', color: '#12B89A' }}>
          {step}
        </span>{' '}
        of 2: Scan the QR code with your Keystone, and then place the Keystone's
        QR code in front of your camera.
      </DialogTitle>
      <DialogContent>
        {step === 1 && (
          <Box sx={{ display: 'flex' }}>
            <LoopQrcode step={1} message={JSON.stringify(qrcode1)} />
            <ScanQrcode step={1} onComplete={step1} />
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ display: 'flex' }}>
            <LoopQrcode step={2} message={message3} />
            <ScanQrcode step={2} onComplete={step2} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant={'outlined'} onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SignTransactionDialog
