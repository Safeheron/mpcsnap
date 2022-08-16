import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  styled,
  TextField,
} from '@mui/material'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

import Loading from '@/components/Loading'
import { useAlert } from '@/hooks'
import { importWalletKeyshard } from '@/service/metamask'

const Input = styled('input')({
  display: 'none',
})

const ImportWalletDialog = ({ onClose, onComplete }) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [filename, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [keystore, setKeystore] = useState('')
  const [password, setPassword] = useState('')
  const alert = useAlert()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      setKeystore(`${reader.result}`)
      fileRef.current!.value = ''
    }
    reader.readAsText(file)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onSubmit = async () => {
    if (!keystore) {
      return alert('Please choose Keystore files')
    }
    if (!password) {
      return alert('Please enter password')
    }

    console.log({
      keystore,
      password,
    })
    setLoading(true)
    const res = await importWalletKeyshard(keystore, password)
    setLoading(false)
    if (res.success && res.address) {
      onComplete(res.address)
    } else {
      alert(res.errMsg)
    }
  }

  return (
    <Dialog open={true} maxWidth={'sm'}>
      <Loading loading={loading}></Loading>
      <DialogTitle>Import MPC Wallet</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <label htmlFor="contained-button-file">
          <Input
            ref={fileRef}
            onChange={handleFileChange}
            id="contained-button-file"
            multiple
            type="file"
          />
          <Button variant="contained" component="span">
            Choose Keystore file
          </Button>
          <span style={{ marginLeft: 10 }}>{filename}</span>
        </label>
        <Box my={'20px'} />
        <FormControl>
          <FormLabel>Password</FormLabel>
          <TextField
            onChange={handlePasswordChange}
            size={'small'}
            placeholder={'Confirm password'}
            type="password"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant={'outlined'} onClick={onClose}>
          Cancel
        </Button>
        <Button variant={'contained'} onClick={onSubmit}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportWalletDialog
