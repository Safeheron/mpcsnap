import { TPCEcdsaKeyGen } from '@safeheron/two-party-ecdsa-js'
import { P1Context } from '@safeheron/two-party-ecdsa-js/dist/lib/keyGen'
import { JsonObject } from '@safeheron/two-party-ecdsa-js/dist/lib/keyGen/jsonObject'
import BN from 'bn.js'
import pako from 'pako'

import Encryptor, { PubCurveBasePoint } from '../enc/Encryptor'
import { DONE_MESSAGE } from '../utils'

class DKGP1 {
  p1Ctx: P1Context
  localAuthPriv: BN
  remoteAuthPub: PubCurveBasePoint

  async createContext(): Promise<{ priv: string; pub: string }> {
    const { priv, pub } = await Encryptor.generateKeyPaire()
    this.localAuthPriv = priv
    this.p1Ctx = await TPCEcdsaKeyGen.P1Context.createContext()
    return {
      priv: Encryptor.encodeAuthPriv(priv),
      pub: Encryptor.encodeAuthPub(pub),
    }
  }

  async step1(remoteAuthPubHex: string): Promise<string> {
    const message1 = this.p1Ctx.step1() as Uint8Array
    this.remoteAuthPub = Encryptor.decodeAuthPub(remoteAuthPubHex)

    return await Encryptor.encryptBytes(
      this.localAuthPriv,
      this.remoteAuthPub,
      message1
    )
  }

  async step2(encryptedMessage2: string) {
    const decryptedMessage2 = Encryptor.decryptBytes(
      this.localAuthPriv,
      this.remoteAuthPub,
      encryptedMessage2
    )
    const message3 = this.p1Ctx.step2(decryptedMessage2)
    const gzipMessage3 = pako.gzip(message3)
    return await Encryptor.encryptBytes(
      this.localAuthPriv,
      this.remoteAuthPub,
      gzipMessage3
    )
  }

  step3(doneMessage: string): JsonObject.JsonObject_KeyShare1 {
    const decryptedDoneMessage = Encryptor.decryptString(
      this.localAuthPriv,
      this.remoteAuthPub,
      doneMessage
    )
    if (decryptedDoneMessage === DONE_MESSAGE) {
      const keyshare1 = this.p1Ctx.exportKeyShare()
      return keyshare1.toJsonObject()
    } else {
      throw new Error('invalid message')
    }
  }
}

export default DKGP1
