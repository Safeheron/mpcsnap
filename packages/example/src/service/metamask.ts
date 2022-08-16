import type {
  CreateWalletContextResponse,
  CreateWalletStep1Response,
  CreateWalletStep2Response,
  CreateWalletStep3Response,
  DeleteWalletResponse,
  ExportWalletKeyshardResponse,
  GetAccountResponse,
  GetBackupStatusResponse,
  ImportWalletKeyshardResponse,
  SignTransactionContextResponse,
  SignTransactionStep1Response,
  SignTransactionStep2Response,
  TransactionObject,
} from '@safeheron/mpcsnap-types'

import { SnapInvokeMethods } from '@/configs/Enums'
import { InvokeReqModel } from '@/service/models'

const snapId =
  process.env.NODE_ENV === 'production'
    ? 'npm:@safeheron/mpcsnap'
    : 'local:http://localhost:3000'
const { ethereum } = window

export async function connect(
  cb: (data: { success: boolean; message?: string }) => void
) {
  console.log('connect...')

  try {
    const result: any = await ethereum?.request({
      method: 'wallet_enable',
      params: [
        {
          wallet_snap: { [snapId]: {} },
        },
      ],
    })
    if (result) {
      const info = result.snaps[snapId]
      console.log(info)

      if (info.error) {
        cb({
          success: false,
          message: info.error.message,
        })
      } else {
        cb({
          success: true,
        })
      }
    }
  } catch (error) {
    cb({
      success: false,
      message: error.message,
    })
  }
}

export async function getSnaps() {
  const res = await ethereum?.request({ method: 'wallet_getSnaps' })
  return res
}

// walletInvokeSnap
export async function walletInvokeSnap(
  params: InvokeReqModel<any>
): Promise<any> {
  console.log('walletInvokeSnap', params)
  try {
    return await ethereum?.request({
      method: 'wallet_invokeSnap',
      params: [snapId, params],
    })
  } catch (error) {
    return { success: false, errMsg: error?.message || 'Unknown snap error' }
  }
}

// ping
export async function heartBeat(): Promise<string> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.heartBeat,
  })
}

// requestAccount
export async function requestAccount(): Promise<GetAccountResponse> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.requestAccount,
  })
}

// queryBackupStatus
export async function queryBackupStatus(): Promise<GetBackupStatusResponse> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.queryBackupStatus,
  })
}

// createWalletContext
export async function createWalletContext(): Promise<CreateWalletContextResponse> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.createWalletContext,
  })
}

// createWalletStep1
export async function createWalletStep1(
  publicKey: string
): Promise<CreateWalletStep1Response> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.createWalletStep1,
    params: {
      publicKey,
    },
  })
}

// createWalletStep2
export async function createWalletStep2(
  message2: string
): Promise<CreateWalletStep2Response> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.createWalletStep2,
    params: {
      message2,
    },
  })
}

// createWalletStep3
export async function createWalletStep3(
  message: string
): Promise<CreateWalletStep3Response> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.createWalletStep3,
    params: {
      message,
    },
  })
}

// importWalletKeyshard
export async function importWalletKeyshard(
  keystore: string,
  password: string
): Promise<ImportWalletKeyshardResponse> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.importWalletKeyshard,
    params: { keystore, password },
  })
}

// exportWalletKeyshard
export async function exportWalletKeyshard(
  password: string
): Promise<ExportWalletKeyshardResponse> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.exportWalletKeyShard,
    params: { password },
  })
}

// signTransactionContext
export async function signTransactionContext(
  transactionObject: TransactionObject
): Promise<SignTransactionContextResponse> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.signTransactionContext,
    params: { transactionObject },
  })
}

// signTransactionStep1
export async function signTransactionStep1(
  message2: string
): Promise<SignTransactionStep1Response> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.signTransactionStep1,
    params: { message2 },
  })
}

// signTransactionStep2
export async function signTransactionStep2(
  message4: string
): Promise<SignTransactionStep2Response> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.signTransactionStep2,
    params: { message4 },
  })
}

// deleteWallet
export async function deleteWallet(): Promise<DeleteWalletResponse> {
  return walletInvokeSnap({
    method: SnapInvokeMethods.deleteWallet,
  })
}
