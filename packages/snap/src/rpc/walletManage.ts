import {
  DeleteWalletResponse,
  ExportWalletKeyshardResponse, GetBackupStatusResponse,
  ImportWalletKeyshardResponse,
} from '@safeheron/mpcsnap-types'

import { MPCSnapState, Wallet } from '../interfaces'
import { showConfirmationDialog } from '../utils/confirmation'
import { decrypt, encrypt } from '../utils/keystore'

export async function exportKeyshard(
  wallet: Wallet,
  password: string
): Promise<ExportWalletKeyshardResponse> {
  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as MPCSnapState

  if (!state || !state['2-2'] || !state['2-2'].keyshard) {
    return Promise.resolve({ success: false, errMsg: 'No matched keyshard' })
  }

  const confirmation = await showConfirmationDialog(wallet, {
    prompt: 'Do you want to export your keyshard?',
  })

  if (!confirmation) {
    return Promise.resolve({
      success: false,
      errMsg: 'User reject to export!',
    })
  }
  const mpcState: MPCSnapState = {
    ...state,
    ['2-2']: {
      ...state['2-2'],
      backuped: true,
    },
  }

  const encrypted = encrypt(password, mpcState['2-2'])

  await wallet.request({
    method: 'snap_manageState',
    params: ['update', mpcState],
  })
  return Promise.resolve({
    success: true,
    keystore: JSON.stringify(encrypted),
  })
}

export async function importKeyshard(
  wallet: Wallet,
  keystore: string,
  password: string
): Promise<ImportWalletKeyshardResponse> {
  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as MPCSnapState

  if (state && state['2-2'] && state['2-2'].keyshard) {
    return Promise.resolve({
      success: false,
      errMsg: 'Keyshard exists! cannot import',
    })
  }

  try {
    const decrypted = decrypt(password, JSON.parse(keystore))

    if(!Object.prototype.hasOwnProperty.call(decrypted.keyshard, 'x1')){
      return Promise.resolve({
        success: false,
        errMsg: 'Snap can only import keyshare1. Gived keystore my be keyshare2. Check again!'
      })
    }

    const mpcState: MPCSnapState = {
      ['2-2']: decrypted,
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', mpcState],
    })

    return Promise.resolve({ success: true, address: mpcState['2-2'].address })
  } catch (e) {
    return Promise.resolve({
      success: false,
      errMsg:
        'Failed to decrypt. Please ensure password and keystore are correct.',
    })
  }
}

export async function deleteWallet(
  wallet: Wallet
): Promise<DeleteWalletResponse> {
  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as MPCSnapState

  if (!state || !state['2-2'] || !state['2-2'].keyshard) {
    return Promise.resolve({ success: false, errMsg: 'Wallet not exists! ' })
  }

  const confirmation = await showConfirmationDialog(wallet, {
    prompt: 'Delete MPC Wallet',
    textAreaContent: `
        Address:
        ${state['2-2'].address}
      `,
  })

  if (!confirmation) {
    return Promise.resolve({
      success: false,
      errMsg: 'User reject to Delete!',
    })
  }

  await wallet.request({
    method: 'snap_manageState',
    params: ['clear'],
  })

  return Promise.resolve({ success: true })
}

export async function queryBackupStatus(
  wallet: Wallet
): Promise<GetBackupStatusResponse> {
  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as MPCSnapState

  if (!state || !state['2-2'] || !state['2-2'].keyshard) {
    return Promise.resolve({ success: true, backuped: false })
  }

  const backuped = state['2-2'].backuped

  return Promise.resolve({ success: true, backuped })
}
