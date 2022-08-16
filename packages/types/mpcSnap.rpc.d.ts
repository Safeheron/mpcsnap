interface BaseResponse {
  success: boolean
  errMsg?: string
}

// ----------- init --------------
export interface GetAccountRequest {
  method: 'mpc_requestAccount'
}

export interface GetAccountResponse extends BaseResponse {
  address?: string
}

// ----------- Create wallet steps --------------
export interface CreateWalletContextRequest {
  method: 'mpc_createWalletContext'
}
export type CreateWalletContextResponse = BaseResponse

export interface CreateWalletStep1Request {
  method: 'mpc_createWalletStep1'
  params: {
    publicKey: string
  }
}
export interface CreateWalletStep1Response extends BaseResponse {
  message1?: string
  publicKey?: string
}

export interface CreateWalletStep2Request {
  method: 'mpc_createWalletStep2'
  params: {
    message2: string
  }
}

export interface CreateWalletStep2Response extends BaseResponse {
  message3?: string
}

export interface CreateWalletStep3Request {
  method: 'mpc_createWalletStep3'
  params: {
    message: string
  }
}
export interface CreateWalletStep3Response extends BaseResponse {
  address?: string
}

// ----------- Export --------------
export interface ExportWalletKeyshardRequest {
  method: 'mpc_exportWalletKeyshard'
  params: {
    password: string
  }
}

export interface ExportWalletKeyshardResponse extends BaseResponse {
  keystore?: string
}

// ----------- Import --------------
export interface ImportWalletKeyshardRequest {
  method: 'mpc_importWalletKeyshard'
  params: {
    password: string
    keystore: string
  }
}

export interface ImportWalletKeyshardResponse extends BaseResponse {
  address?: string
}

// ----------- delete --------------
export interface DeleteWalletRequest {
  method: 'mpc_deleteWallet'
}

export type DeleteWalletResponse = BaseResponse

// ----------- delete --------------
export interface GetBackupStatusRequest {
  method: 'mpc_queryBackupStatus'
}

export interface GetBackupStatusResponse extends BaseResponse {
  backuped: boolean
}

// ----------- Send transaction steps --------------

export interface TransactionObject {
  to: string
  value: string
  chainId: number
  nonce: number
  data: string
  gasLimit: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
}

export interface SignTransactionContextRequest {
  method: 'mpc_signTransactionContext'
  params: {
    transactionObject: Record<string, unknown>
  }
}
export interface SignTransactionContextResponse extends BaseResponse {
  message1?: string
}

export interface SignTransactionStep1Request {
  method: 'mpc_signTransactionStep1'
  params: {
    message2: string
  }
}

export interface SignTransactionStep1Response extends BaseResponse {
  message3?: string
}

export interface SignTransactionStep2Request {
  method: 'mpc_signTransactionStep2'
  params: {
    message4: string
  }
}

export interface SignTransactionStep2Response extends BaseResponse {
  signedRawTransaction?: string
}

// ----------- heartbeat --------------
export interface HeartbeatRequest {
  method: 'mpc_snapKeepAlive'
}

export type HeartbeatResponse = 'alived'

export type MetamaskSnapMpcSnapRequest =
  | GetAccountRequest
  | CreateWalletContextRequest
  | CreateWalletStep1Request
  | CreateWalletStep2Request
  | CreateWalletStep3Request
  | ExportWalletKeyshardRequest
  | ImportWalletKeyshardRequest
  | SignTransactionContextRequest
  | SignTransactionStep1Request
  | SignTransactionStep2Request
  | HeartbeatRequest
  | DeleteWalletRequest
  | GetBackupStatusRequest

export type MetamaskSnapMpcSnapMethods = MetamaskSnapMpcSnapRequest['method']

export type MetamaskSnapMpcSnapResponse = {
  success: boolean
  errMsg?: string
} & (
  | CreateWalletContextRequest
  | ExportWalletKeyshardResponse
  | ImportWalletKeyshardResponse
)
