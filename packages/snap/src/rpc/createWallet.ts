import {
  CreateWalletContextResponse,
  CreateWalletStep1Response,
  CreateWalletStep2Response,
  CreateWalletStep3Response,
} from '@safeheron/mpcsnap-types'
import { deriveAddressFromCurvePoint, KeyShare1JsonObject } from '@safeheron/two-party-mpc-adapter'

import contextManager from '../context/ContextManager'
import KeyGenContext from '../context/KeyGenContext'
import { MPCSnapState, Wallet } from '../interfaces'
import { showConfirmationDialog } from '../utils/confirmation'

async function createWalletContext(
  wallet: Wallet
): Promise<CreateWalletContextResponse> {
  const confirmed = await showConfirmationDialog(wallet, {
    prompt: 'Do you want to create an MPC wallet?',
  })
  if (!confirmed) {
    return Promise.resolve({
      success: false,
      errMsg: 'User reject to create wallet.',
    })
  }

  const keyGenContext = contextManager.createContext('create')

  try {
    await keyGenContext?.next()
    return Promise.resolve({ success: true })
  } catch (e) {
    return Promise.resolve({ success: false, errMsg: 'Create context failed.' })
  }
}

async function createWalletStep1(
  wallet: Wallet,
  publicKey: string
): Promise<CreateWalletStep1Response> {
  const keyGenContext = contextManager.getContext() as KeyGenContext
  if (!keyGenContext) {
    return Promise.resolve({ success: false, errMsg: 'No context' })
  }

  const pkOfSnap = keyGenContext.getAuthPub()
  if (!pkOfSnap) {
    return Promise.resolve({
      success: false,
      errMsg: 'Snap publickey not exist.',
    })
  }

  const message1 = (await keyGenContext.next(publicKey)) as string

  if (!message1) {
    return Promise.resolve({ success: false, errMsg: 'MPC step1 failed.' })
  }
  return Promise.resolve({success: true, message1, publicKey: pkOfSnap})
}

async function createWalletStep2(
  wallet: Wallet,
  message2: string
): Promise<CreateWalletStep2Response> {
  const keyGenContext = contextManager.getContext()
  if (!keyGenContext) {
    return Promise.resolve({ success: false, errMsg: 'No context' })
  }

  const message3 = (await keyGenContext.next(message2)) as string

  return Promise.resolve({success: true, message3})
}

async function createWalletStep3(
  wallet: Wallet,
  doneMessage: string
): Promise<CreateWalletStep3Response> {
  const keyGenContext = contextManager.getContext() as KeyGenContext
  if (!keyGenContext) {
    return Promise.resolve({ success: false, errMsg: 'No context' })
  }

  const keyshard = (await keyGenContext.next(doneMessage)) as KeyShare1JsonObject

  const address = deriveAddressFromCurvePoint(
    keyshard.Q!.x!,
    keyshard.Q!.y!
  )
  const pkOfKeystone = keyGenContext.getPkOfKeystone() as string
  const authPriv = keyGenContext.getAuthPriv()
  const authPub = keyGenContext.getAuthPub()

  if(!authPriv || !authPub || !pkOfKeystone || !keyshard){
    throw new Error('Invalid data. Create MPC wallet failed.')
  }

  const state: MPCSnapState = {
    '2-2': {
      address,
      backuped: false,
      keyshard,
      pkOfKeystone,
      authPriv,
      authPub
    },
  }

  wallet.request({
    method: 'snap_manageState',
    params: ['update', state],
  })

  contextManager.destroy()

  return Promise.resolve({ success: true, address: address })
}

export {
  createWalletContext,
  createWalletStep1,
  createWalletStep2,
  createWalletStep3,
}
