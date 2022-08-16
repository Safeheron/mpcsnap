import { arrayify, BytesLike, concat, hexlify } from '@ethersproject/bytes'
import { keccak256 } from '@ethersproject/keccak256'
import { UnicodeNormalizationForm } from '@ethersproject/strings'
import { MPCKeystoreJSONObject } from '@safeheron/mpcsnap-types'
import aes from 'aes-js'
import { ethers } from 'ethers'
import { randomBytes } from 'ethers/lib/utils'
import { syncScrypt } from 'scrypt-js'

import { MPCSnapState } from '../interfaces'

function looseArrayify(hexString: string): Uint8Array {
  if (hexString.substring(0, 2) !== '0x') {
    // eslint-disable-next-line no-param-reassign
    hexString = '0x' + hexString
  }
  return arrayify(hexString)
}

function uuidV4(randomValue: BytesLike): string {
  const bytes = arrayify(randomValue)

  bytes[6] = (bytes[6] & 0x0f) | 0x40

  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const value = hexlify(bytes)

  return [
    value.substring(2, 10),
    value.substring(10, 14),
    value.substring(14, 18),
    value.substring(18, 22),
    value.substring(22, 34),
  ].join('-')
}

function getPasswordBytes(password: string) {
  return ethers.utils.toUtf8Bytes(password, UnicodeNormalizationForm.NFKC)
}

export function encrypt(
  password: string,
  mpcSnapState: MPCSnapState['2-2']
): MPCKeystoreJSONObject {
  const passwordBytes = getPasswordBytes(password)

  const keysharedBytes = aes.utils.utf8.toBytes(JSON.stringify(mpcSnapState))

  const salt = randomBytes(32)
  const iv = randomBytes(16)
  const uuidRandom = randomBytes(16)

  /**
   * TODO
   * In ether.js, the N value is 1 << 17, but in the snap it takes too long to run,
   * we can only reduce this number to 1 << 16
   */
  const N = 1 << 16,
    r = 8,
    p = 1

  const key = syncScrypt(passwordBytes, salt, N, r, p, 64)

  const derivedKey = key.slice(0, 16)
  const macPrefix = key.slice(16, 32)

  const counter = new aes.Counter(iv)
  const aesCtr = new aes.ModeOfOperation.ctr(derivedKey, counter)
  const ciphertext = arrayify(aesCtr.encrypt(keysharedBytes))

  const mac = ethers.utils.keccak256(concat([macPrefix, ciphertext]))

  const data: MPCKeystoreJSONObject = {
    address: mpcSnapState.address,
    id: uuidV4(uuidRandom),
    version: 3,
    Crypto: {
      cipher: 'aes-128-ctr',
      cipherparams: {
        iv: hexlify(iv).substring(2),
      },
      ciphertext: hexlify(ciphertext).substring(2),
      kdf: 'scrypt',
      kdfparams: {
        salt: hexlify(salt).substring(2),
        n: N,
        dklen: 32,
        p: p,
        r: r,
      },
      mac: mac.substring(2),
    },
  }

  return data
}

export function decrypt(
  password: string,
  keystoreJson: MPCKeystoreJSONObject
): MPCSnapState['2-2'] {
  const passwordBytes = getPasswordBytes(password)

  const kdfParams = keystoreJson.Crypto.kdfparams
  const salt = looseArrayify(kdfParams.salt)
  const N = kdfParams.n
  const r = kdfParams.r
  const p = kdfParams.p
  if (!N || !r || !p) {
    throw new Error('kdf params error')
  }

  if ((N & (N - 1)) !== 0) {
    throw new Error('invalid kdf params N: ' + N)
  }

  const dkLen = kdfParams.dklen
  if (dkLen !== 32) {
    throw new Error('invalid kdf params dkLen: ' + dkLen)
  }

  const key = syncScrypt(passwordBytes, salt, N, r, p, 64)

  const ciphertext = looseArrayify(keystoreJson.Crypto.ciphertext)
  const computedMAC = hexlify(
    keccak256(concat([key.slice(16, 32), ciphertext]))
  ).substring(2)
  const paramMac = keystoreJson.Crypto.mac
  if (computedMAC !== paramMac.toLowerCase()) {
    throw new Error('invalid password')
  }

  const derivedKey = key.slice(0, 16)
  const iv = looseArrayify(keystoreJson.Crypto.cipherparams.iv)

  const counter = new aes.Counter(iv)
  const aesCtr = new aes.ModeOfOperation.ctr(derivedKey, counter)

  const encryptedBytes = aesCtr.decrypt(ciphertext)

  const stateString = aes.utils.utf8.fromBytes(encryptedBytes)

  return JSON.parse(stateString)
}
