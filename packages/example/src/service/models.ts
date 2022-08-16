import { BigNumber } from 'ethers'

import { SnapInvokeMethods } from '@/configs/Enums'
export interface InvokeReqModel<T> {
  method: SnapInvokeMethods
  params?: T
}

export interface TxRecordItem {
  txHash: string
}

export interface NetworkItem {
  chainId: string
  name: string
  explorer: string
}

export interface CreateQrcode1 {
  message1: string
  pubkey1: string
}

export interface SignQrcode1 {
  message1: string
  txObj: any
  networkName: string
}

export interface BaseTxObj {
  to: string
  data: string //hex
  value: string
}
