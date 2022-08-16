import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'

const AddressQrcode = ({ address, onClose }) => {
  return (
    <Dialog aria-label="close" open={true} maxWidth={'sm'}>
      <DialogTitle>
        Address
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
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <QRCodeSVG value={`${address}`} size={300} />
        <Box
          sx={{
            marginTop: 2,
          }}
        >
          {address}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AddressQrcode
