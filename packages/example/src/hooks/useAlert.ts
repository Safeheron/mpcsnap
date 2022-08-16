import { useSnackbar, VariantType } from 'notistack'

const useAlert = () => {
  const { enqueueSnackbar } = useSnackbar()

  const message = (msg?: string, type: VariantType = 'error') => {
    enqueueSnackbar(msg, { variant: type })
  }

  return message
}

export default useAlert
