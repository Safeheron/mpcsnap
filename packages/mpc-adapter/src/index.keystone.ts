import { Prime,Rand } from '@safeheron/crypto-rand'
import BN from 'bn.js'
import { Buffer } from 'safe-buffer'

import { deriveAddressFromCurvePoint, DKGP2, Encryptor, SignerP2 } from './index'

function randomBridge(byteSize: number, isPrime: boolean): string{
  // @ts-ignore
  const randomResult = window.__randomHex__(byteSize, isPrime)
  return randomResult.value
}

function randomBytesImpl(byteSize: number){
  const hexStr = randomBridge(byteSize, false)
  const bufRes = Buffer.from(hexStr, 'hex')
  return Promise.resolve(bufRes)
}

function randomPrimeImpl(byteSize: number){
  while (true){
    const hexStr = randomBridge(byteSize, true)
    const bnRes = new BN(hexStr, 16)
    if(Prime.isProbablyPrime(bnRes)){
      return bnRes
    }
  }
}

Rand.config_randomBytesImp(randomBytesImpl)
Rand.config_randomPrimeImp(randomPrimeImpl)

export { deriveAddressFromCurvePoint,DKGP2, Encryptor,SignerP2 }
