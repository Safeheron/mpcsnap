import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material'
import type { TransactionObject } from '@safeheron/mpcsnap-types'
import { ChangeEvent, FC, useCallback, useState } from 'react'

import Loading from '@/components/Loading'
import { useAlert } from '@/hooks'
import SignTransactionDialog from '@/modules/SignTransactionDialog'
import { signTransactionContext } from '@/service/metamask'
import { BaseTxObj, NetworkItem, SignQrcode1 } from '@/service/models'
import { ethers, provider, stringToHex } from '@/utils'

import FeeDataDialog from './FeeDataDialog'

interface Props {
  address: string
  network: NetworkItem
  onComplete: (hash: string) => void
  startHeartBeat: () => void
  stopHeartBeat: () => void
}

const Transfer: FC<Props> = ({
  address,
  network,
  onComplete,
  startHeartBeat,
  stopHeartBeat,
}) => {
  const alert = useAlert()

  const [loading, setLoading] = useState(false)
  const [feeDataVisible, setFeeDataVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [data, setData] = useState('')
  const [txObj, setTxObj] = useState({} as TransactionObject)

  const [qrcode1, setQrcode1] = useState({} as SignQrcode1)

  // const handleExpand = () => {
  //   if (expand) {
  //     setNonce('')
  //     setMaxFee('')
  //     setPriority('')
  //   }
  //   setExpand(old => !old)
  // }
  const handleToChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTo(event.target.value)
    },
    [setTo]
  )
  const handleAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value)
    },
    [setAmount]
  )

  const handleDataChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setData(event.target.value)
    },
    [setData]
  )

  const onSubmit = async () => {
    if (!provider) return
    // if (!to) return alert('To is required')
    // if (!amount) return alert('Amount is required')
    try {
      const baseTx: BaseTxObj = {
        to,
        value: ethers.utils.parseUnits(amount, 18).toHexString(),
        data: stringToHex(data),
      }
      setLoading(true)

      const defaultNonce = await provider.getTransactionCount(address)
      const chainId = (await provider.getNetwork()).chainId
      const feeData = await provider.getFeeData()
      const gasLimit = (await provider.estimateGas(baseTx)).toString()
      const maxFeePerGas = ethers.utils.formatUnits(
        // @ts-ignore
        feeData.maxFeePerGas,
        'gwei'
      )

      const maxPriorityFeePerGas = ethers.utils.formatUnits(
        // @ts-ignore
        feeData.maxPriorityFeePerGas,
        'gwei'
      )

      const fullTx: TransactionObject = {
        nonce: defaultNonce,
        to,
        value: amount,
        data,
        chainId,
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit,
      }

      setTxObj(fullTx)
      setLoading(false)
      setFeeDataVisible(true)
    } catch (error) {
      console.log(error)
      setLoading(false)

      alert('Please check address')
    }
  }

  const handleConfirmComplete = async (unsignedTx: TransactionObject) => {
    startHeartBeat()
    setLoading(true)
    const res = await signTransactionContext(unsignedTx)
    setLoading(false)

    if (res.success && res.message1) {
      setQrcode1({
        message1: res.message1,
        txObj: unsignedTx,
        networkName: network.name,
      })
      setDialogVisible(true)
    } else {
      alert(res.errMsg)
      stopHeartBeat()
    }
  }

  const handleSignComplete = (signedRawTransaction: string) => {
    setDialogVisible(false)
    console.log('signedRawTransaction', signedRawTransaction)
    sendTx(signedRawTransaction)
  }

  const sendTx = async (signedRawTransaction: string) => {
    stopHeartBeat()
    if (!provider) return
    try {
      setLoading(true)
      const response = await provider.sendTransaction(signedRawTransaction)
      setLoading(false)
      if ('error' in response) {
        console.log(response)
        alert('Failed')
        return
      }
      console.log('txhash', response.hash)
      onComplete(response.hash)

      const receipt = await response.wait()

      console.log(receipt)
    } catch (error) {
      setLoading(false)
      alert(error.error.message)
    }
  }

  const handleStepClose = () => {
    stopHeartBeat()
    setDialogVisible(false)
  }

  return (
    <Card variant={'outlined'}>
      <Loading loading={loading} />
      <CardHeader title={'Send'} />
      <CardContent>
        <Grid
          container
          spacing={2}
          direction={'row'}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={6}>
            <TextField
              size="medium"
              fullWidth
              id="to"
              label="To"
              variant="outlined"
              value={to}
              onChange={handleToChange}
            />
            <Box m="20px" />
            <TextField
              size="medium"
              fullWidth
              id="amount"
              label="Amount"
              variant="outlined"
              value={amount}
              onChange={handleAmountChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">ETH</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="medium"
              rows={4}
              multiline
              fullWidth
              id="data"
              label="Hex Data"
              variant="outlined"
              value={data}
              onChange={handleDataChange}
            />
          </Grid>
        </Grid>
        <Box m="20px" />
      </CardContent>
      <CardActions sx={{ padding: 2 }}>
        <Button variant={'contained'} size="small" onClick={onSubmit}>
          Send Transaction
        </Button>
      </CardActions>
      {feeDataVisible && (
        <FeeDataDialog
          txObj={txObj}
          onClose={() => setFeeDataVisible(false)}
          onComplete={handleConfirmComplete}
        />
      )}

      {dialogVisible && (
        <SignTransactionDialog
          onClose={handleStepClose}
          onComplete={handleSignComplete}
          qrcode1={qrcode1}
        />
      )}
    </Card>
  )
}

export default Transfer
