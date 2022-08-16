import { QrCode } from '@mui/icons-material'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import copy from 'copy-to-clipboard'
import { FC, useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import { useAlert } from '@/hooks'
import AddressQrcode from '@/modules/AddressQrcode'
import { deleteWallet } from '@/service/metamask'
import { NetworkItem } from '@/service/models'
import { wei2eth } from '@/utils'

interface Props {
  address: string
  balance: string
  network: NetworkItem
  onDelete: () => void
  onExport: () => void
}

const AddressCard: FC<Props> = ({
  address,
  balance,
  network,
  onDelete,
  onExport,
}) => {
  const [loading, setLoading] = useState(false)
  const [qrcodeVisible, setQrcodeVisible] = useState(false)

  const deleteAccout = async () => {
    setLoading(true)
    const res = await deleteWallet()
    setLoading(false)
    if (res.success) {
      onDelete()
    }
  }

  const alert = useAlert()
  const doCopyAddress = () => {
    copy(address)
    alert('Address has been copied!', 'success')
  }

  return (
    <>
      <Loading loading={loading} />
      <Card variant="outlined">
        <CardHeader
          title={'Address'}
          action={<Typography>{network.name}</Typography>}
        />
        <CardContent>
          <Grid
            container
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span>{address || '0x......'}</span>
              {!!address && (
                <>
                  &nbsp;
                  <ContentCopyIcon
                    onClick={doCopyAddress}
                    sx={{ cursor: 'pointer' }}
                  />
                  &nbsp;
                  <QrCode
                    onClick={() => setQrcodeVisible(true)}
                    sx={{ cursor: 'pointer' }}
                  />
                </>
              )}
              {qrcodeVisible && (
                <AddressQrcode
                  address={address}
                  onClose={() => setQrcodeVisible(false)}
                />
              )}
            </Box>
            <div>
              <Button onClick={onExport}>
                <CloudDownloadIcon />
              </Button>

              <Button onClick={deleteAccout}>
                <DeleteForeverIcon />
              </Button>
            </div>
          </Grid>
          <Typography style={{ fontSize: '18px' }} fontWeight={'bold'}>
            {balance ? wei2eth(balance) : 0} ETH
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default AddressCard
