import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import type { TransactionObject } from '@safeheron/mpcsnap-types'
import { ChangeEvent, FC, useCallback, useState } from 'react'

import { wei2eth } from '@/utils'

interface Props {
  txObj: TransactionObject
  onClose: () => void
  onComplete: (tx: TransactionObject) => void
}

const FeeDataDialog: FC<Props> = ({ txObj, onClose, onComplete }) => {
  const [nonce, setNonce] = useState(`${txObj.nonce}`)
  const [gasLimit, setGasLimit] = useState<string>(
    `${txObj.gasLimit?.toString()}`
  )
  const [maxFee, setMaxFee] = useState<string>(txObj.maxFeePerGas)
  const [priority, setPriority] = useState<string>(txObj.maxPriorityFeePerGas)
  const [nonceInfo, setNonceInfo] = useState(
    {} as { error: boolean; text: string }
  )

  const handleNonceChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.value || !/^[+]{0,1}(\d+)$/.test(event.target.value)) {
        setNonceInfo({
          error: true,
          text: 'Nonce must be a positive integer',
        })
      } else {
        setNonceInfo({
          error: false,
          text: '',
        })
      }
      setNonce(event.target.value)
    },
    [setNonce]
  )
  const handleGasLimitChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setGasLimit(event.target.value)
    },
    [setGasLimit]
  )
  const handleMaxFeeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setMaxFee(event.target.value)
    },
    [setMaxFee]
  )

  const handlePriorityChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPriority(event.target.value)
    },
    [setPriority]
  )
  const onSubmit = () => {
    console.log(txObj)

    const displayTx: TransactionObject = {
      ...txObj,
      nonce: parseInt(nonce),
      gasLimit,
      maxFeePerGas: `${maxFee}`,
      maxPriorityFeePerGas: `${priority}`,
    }
    console.log(displayTx)
    onClose()
    onComplete(displayTx)
  }

  return (
    <Dialog open={true} maxWidth={'sm'}>
      <DialogTitle>
        Confirm Data
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box>to: {txObj.to}</Box>
          <Box> amount: {txObj.value} ETH</Box>

          <TextField
            label="Nonce"
            value={nonce}
            sx={{ m: 1, width: '40ch' }}
            onChange={handleNonceChange}
            error={nonceInfo.error}
            helperText={nonceInfo.text}
          />
          <TextField
            label="Gas Limit"
            value={gasLimit}
            sx={{ m: 1, width: '40ch' }}
            onChange={handleGasLimitChange}
          />
          <TextField
            label="Max Base Fee"
            value={maxFee}
            sx={{ m: 1, width: '40ch' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">GWei</InputAdornment>
              ),
            }}
            onChange={handleMaxFeeChange}
          />
          <TextField
            label="Priority"
            value={priority}
            sx={{ m: 1, width: '40ch' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">GWei</InputAdornment>
              ),
            }}
            onChange={handlePriorityChange}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button variant={'contained'} onClick={onSubmit}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FeeDataDialog
