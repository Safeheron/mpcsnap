import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  TextField,
} from '@mui/material'
import { ChangeEvent, useCallback, useState } from 'react'

import Loading from '@/components/Loading'
import { isPasswordValid } from '@/helpers/VerifyRules'
import { useAlert } from '@/hooks'
import { exportWalletKeyshard } from '@/service/metamask'

const ExportWalletDialog = ({ onClose, onComplete }) => {
  const alert = useAlert()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
    },
    [setPassword]
  )
  const handleRePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setRePassword(e.target.value)
    },
    [setRePassword]
  )

  const onSubmit = async () => {
    if (!password) {
      return alert('Password is Required')
    }
    if (!isPasswordValid(password)) {
      return alert(
        'Must contain at least 10 characters and include upper and lower case letters and digits.'
      )
    }
    if (password !== rePassword) {
      return alert('The password entered twice must be the same')
    }

    setLoading(true)
    const res = await exportWalletKeyshard(password)
    setLoading(false)
    console.log(res)

    if (res.success && res.keystore) {
      onClose()
      onComplete()
      downloadKeyShard(res.keystore)
    } else {
      alert(res.errMsg)
    }
  }

  const downloadKeyShard = (data: string) => {
    const blob = new Blob([data])
    const reader = new FileReader()
    reader.onloadend = () => {
      const anchor: HTMLAnchorElement = document.createElement('a')
      anchor.href = reader.result as string
      anchor.style.display = 'none'
      anchor.download = 'mpc_keystroe.json'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.parentNode?.removeChild(anchor)
    }
    reader.readAsDataURL(blob)
  }

  return (
    <Dialog open={true} maxWidth={'sm'}>
      <Loading loading={loading}></Loading>
      <DialogTitle>Export MPC Wallet</DialogTitle>
      <DialogContent>
        <FormControl>
          <FormLabel>Enter a password to encrypt your MPC key shard</FormLabel>
          <TextField
            size={'small'}
            placeholder={'Please enter your password'}
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </FormControl>
        <Box my={'20px'} />
        <FormControl>
          <FormLabel>
            Must contain at least 10 characters and include upper and lower case
            letters and digits. Symbols are allowed. Case sensitive.
          </FormLabel>
          <TextField
            size={'small'}
            placeholder={'Confirm password'}
            type="password"
            value={rePassword}
            onChange={handleRePasswordChange}
          />
        </FormControl>
        <Box my={'20px'} />
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button variant={'outlined'} onClick={onClose}>
          Cancel
        </Button>
        <Button variant={'contained'} onClick={onSubmit}>
          Export
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExportWalletDialog
