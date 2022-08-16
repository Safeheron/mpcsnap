import './utils/RandomConfig'

import { MPCSnapRpcHandler, Wallet } from './interfaces'
import {
  createWalletContext,
  createWalletStep1,
  createWalletStep2,
  createWalletStep3,
} from './rpc/createWallet'
import { heartbeat } from './rpc/heartbeat'
import { requestAccount } from './rpc/requestAccount'
import {
  signTransactionContext,
  signTransactionStep1,
  signTransactionStep2,
} from './rpc/sendTransaction'
import {
  deleteWallet,
  exportKeyshard,
  importKeyshard,
  queryBackupStatus,
} from './rpc/walletManage'

declare let wallet: Wallet

const rpcMethodHandler: MPCSnapRpcHandler = async ({ origin, request } ) => {
  console.log('MPC Snap RPC hander: ', origin, request)

  switch (request.method) {
    case 'mpc_snapKeepAlive':
      return heartbeat()

    case 'mpc_requestAccount':
      return requestAccount(wallet)

    case 'mpc_createWalletContext':
      return createWalletContext(wallet)
    case 'mpc_createWalletStep1':
      return createWalletStep1(wallet, request.params.publicKey)
    case 'mpc_createWalletStep2':
      return createWalletStep2(wallet, request.params.message2)
    case 'mpc_createWalletStep3':
      return createWalletStep3(wallet, request.params.message)

    case 'mpc_exportWalletKeyshard':
      return exportKeyshard(wallet, request.params.password)
    case 'mpc_importWalletKeyshard':
      return importKeyshard(
        wallet,
        request.params.keystore,
        request.params.password
      )
    case 'mpc_deleteWallet':
      return deleteWallet(wallet)
    case 'mpc_queryBackupStatus':
      return queryBackupStatus(wallet)

    case 'mpc_signTransactionContext':
      return signTransactionContext(wallet, request.params.transactionObject)
    case 'mpc_signTransactionStep1':
      return signTransactionStep1(wallet, request.params.message2)
    case 'mpc_signTransactionStep2':
      return signTransactionStep2(wallet, request.params.message4)

    default:
      throw new Error('Method not found.')
  }
}

// For snap-cli <= 0.15.0
// wallet.registerRpcMessageHandler(rpcMethodHandler)

// For snap-cli > 0.16.0
export const onRpcRequest = rpcMethodHandler
