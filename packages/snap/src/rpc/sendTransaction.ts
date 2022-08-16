import {
  SignTransactionContextResponse,
  SignTransactionStep1Response,
  SignTransactionStep2Response,
} from '@safeheron/mpcsnap-types'

import contextManager from '../context/ContextManager'
import SignContext from '../context/SignContext'
import { MPCSnapState, Wallet } from '../interfaces'
import { showConfirmationDialog } from '../utils/confirmation'

async function signTransactionContext(
  wallet: Wallet,
  transactionObject: Record<string, unknown>
): Promise<SignTransactionContextResponse> {
  // TODO validate transactionObject

  const confirmed = await showConfirmationDialog(wallet, {
    prompt: 'Do you want to send transaction?',
    textAreaContent: JSON.stringify(transactionObject, null, 2),
  })
  if (!confirmed) {
    return Promise.resolve({
      success: false,
      errMsg: 'User reject to send transaction.',
    })
  }

  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as MPCSnapState
  if (!state || !state['2-2'] || !state['2-2'].keyshard) {
    return Promise.resolve({
      success: false,
      errMsg: "No wallet. Can't sign.",
    })
  }

  const mpcSnapState = state['2-2']

  const keyshare1 = mpcSnapState.keyshard
  const localAuthPriv = mpcSnapState.authPriv
  const remoteAuthPub = mpcSnapState.pkOfKeystone

  const signContext = contextManager.createContext('sign')
  const message1 = await signContext.next(keyshare1, transactionObject, localAuthPriv, remoteAuthPub) as string

  return Promise.resolve({ success: true, message1: message1 })
}

async function signTransactionStep1(
  wallet: Wallet,
  message2: string
): Promise<SignTransactionStep1Response> {
  const context = contextManager.getContext() as SignContext

  if (!context) {
    return Promise.resolve({ success: false, errMsg: 'No context.' })
  }

  const message3 = (await context?.next(message2)) as string

  return Promise.resolve({ success: true, message3: message3 })
}

async function signTransactionStep2(
  wallet: Wallet,
  message4: string
): Promise<SignTransactionStep2Response> {
  const context = contextManager.getContext() as SignContext

  if (!context) {
    return Promise.resolve({ success: false, errMsg: 'No context.' })
  }

  try {
    const rawTransaction = await context.next(message4)

    contextManager.destroy()
    return Promise.resolve({
      success: true,
      signedRawTransaction: rawTransaction,
    })
  } catch (error) {
    return Promise.resolve({
      success: false,
      errMsg: error.message || 'Signing failed',
    })
  }
}

export { signTransactionContext, signTransactionStep1, signTransactionStep2 }
