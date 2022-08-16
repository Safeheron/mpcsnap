import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import LoopQrcode from '@/components/LoopQrcode'
import ScanQrcode from '@/components/ScanQrcode'
import {
  createWalletStep1,
  createWalletStep2,
  createWalletStep3,
} from '@/service/metamask'
import { CreateQrcode1 } from '@/service/models'

const steps = [
  'Place the Keystone’s QR code in front of your camera.',
  'Scan the QR code with your Keystone, and then place the Keystone’s QR code in front of your camera.',
  'Scan the QR code with your Keystone, and then place the Keystone’s QR code in front of your camera.',
]

const CreateStepDialog = ({ onClose, onComplete }) => {
  const [loading, setLoading] = useState(false)
  const [message3, setMessage3] = useState('')
  const [step, setStep] = useState(1)

  const [qrcode1, setQrcode1] = useState({} as CreateQrcode1)

  const step1 = async (publicKey: string) => {
    console.log('step1 end')

    setLoading(true)
    const res = await createWalletStep1(publicKey)
    setLoading(false)
    console.log(res)

    if (res.success) {
      console.log('message1:', `${res.message1}`)
      localStorage.setItem('authPubOfP1', `${res.publicKey}`)
      setQrcode1({
        message1: `${res.message1}`,
        pubkey1: `${res.publicKey}`,
      })
      setStep(2)
    }
  }

  const step2 = async (message2: string) => {
    console.log('step2 end')
    console.log('message1', qrcode1.message1)

    setLoading(true)
    const res = await createWalletStep2(message2)
    console.log(res)
    setLoading(false)
    if (res.success && res.message3) {
      console.log('message3:', res.message3)
      setMessage3(res.message3)
      setStep(3)
    }
  }

  const step3 = async (message: string) => {
    console.log('step3 end')

    setLoading(true)

    const res = await createWalletStep3(message)
    console.log(res)
    setLoading(false)
    if (res.success) {
      onComplete(res.address)
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
        of 3:
        {steps[step - 1]}
      </DialogTitle>
      <DialogContent>
        {step === 1 && (
          <Box sx={{ display: 'flex' }}>
            <LoopQrcode step={1} message="" />
            <ScanQrcode step={1} onComplete={step1} />
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ display: 'flex' }}>
            <LoopQrcode step={2} message={JSON.stringify(qrcode1)} />
            <ScanQrcode step={2} onComplete={step2} />
          </Box>
        )}
        {step === 3 && (
          <Box sx={{ display: 'flex' }}>
            <LoopQrcode step={3} message={message3} encodings="base64" />
            <ScanQrcode step={3} onComplete={step3} />
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

export default CreateStepDialog
