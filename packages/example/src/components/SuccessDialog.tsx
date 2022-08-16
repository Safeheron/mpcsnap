import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import React, { useImperativeHandle, useState } from 'react'

export interface SuccessDialogHandle {
  open(title: string): void
}

const SuccessDialog: React.ForwardRefRenderFunction<SuccessDialogHandle> = (
  props,
  ref
) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')

  useImperativeHandle(
    ref,
    () => ({
      open: (t: string) => {
        setTitle(t)
        setOpen(true)
      },
    }),
    []
  )

  const handleClose = () => setOpen(false)

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent style={{ padding: '20 30px', minWidth: '300px' }}>
        <p>
          <CheckCircleOutlineIcon
            color={'primary'}
            fontSize={'large'}
            style={{ verticalAlign: 'middle' }}
          />
          <span style={{ verticalAlign: 'middle', fontSize: 20 }}>
            {' '}
            {title}{' '}
          </span>
        </p>
      </DialogContent>
      <DialogActions>
        <Button variant={'contained'} onClick={handleClose}>
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.forwardRef(SuccessDialog)
