import { JsonObject } from '@safeheron/two-party-ecdsa-js/dist/lib/keyGen/jsonObject'
import BN from 'bn.js'
import { BigNumber, ethers } from 'ethers'

import { PubCurveBasePoint } from '../enc/Encryptor'
import Encryptor from '../enc/Encryptor'

class Signer {
  localAuthPriv: BN
  remoteAuthPub: PubCurveBasePoint
  keyshare: string
  unsignedTx: Record<string, string | number>

  constructor(
    /*eslint-disable*/
    keyshare:
      | string
      | JsonObject.JsonObject_KeyShare1
      | JsonObject.JsonObject_KeyShare2,
    localAuthPriv: string,
    remoteAuthPub: string
  ) {
    this.keyshare =
      typeof keyshare === 'string' ? keyshare : JSON.stringify(keyshare)
    this.localAuthPriv = Encryptor.decodeAuthPriv(localAuthPriv)
    this.remoteAuthPub = Encryptor.decodeAuthPub(remoteAuthPub)
  }

  serializeUnsignedTx(unsignedTx: Record<string, string | number>): BN {
    const txObj = {
      ...unsignedTx,
      value: ethers.utils.parseUnits(`${unsignedTx.value}`, 18).toHexString(),
      data: unsignedTx.data
        ? (
          ethers.utils.isHexString(unsignedTx.data)
          ? unsignedTx.data
          : ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`${unsignedTx.data}`))
        )
        : '',
      gasLimit: BigNumber.from(unsignedTx.gasLimit).toHexString(),
      maxFeePerGas: ethers.utils
        .parseUnits(`${unsignedTx.maxFeePerGas}`, 'gwei')
        .toHexString(),
      maxPriorityFeePerGas: ethers.utils
        .parseUnits(`${unsignedTx.maxPriorityFeePerGas}`, 'gwei')
        .toHexString(),
      type: 2,
    }

    this.unsignedTx = txObj

    const serializedTx = ethers.utils.serializeTransaction(this.unsignedTx)
    let unsignedTxHash = ethers.utils.keccak256(serializedTx)
    if (unsignedTxHash.startsWith('0x')) {
      unsignedTxHash = unsignedTxHash.substring(2)
    }
    return new BN(unsignedTxHash, 16)
  }
}

export default Signer
