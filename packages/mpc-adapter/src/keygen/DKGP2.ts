import { TPCEcdsaKeyGen } from '@safeheron/two-party-ecdsa-js'
import { P2Context } from '@safeheron/two-party-ecdsa-js/dist/lib/keyGen'
import { JsonObject } from '@safeheron/two-party-ecdsa-js/dist/lib/keyGen/jsonObject'
import BN from 'bn.js'
import pako from 'pako'

import Encryptor, { PubCurveBasePoint } from '../enc/Encryptor'
import { DONE_MESSAGE } from '../utils'

class DKGP2 {
  p2Ctx: P2Context
  localAuthPrivHex: BN
  remoteAuthPubHex: PubCurveBasePoint

  async createContext(): Promise<{ priv: string; pub: string }> {
    const { priv, pub } = await Encryptor.generateKeyPaire()
    this.localAuthPrivHex = priv
    this.p2Ctx = await TPCEcdsaKeyGen.P2Context.createContext()
    return {
      priv: Encryptor.encodeAuthPriv(priv),
      pub: Encryptor.encodeAuthPub(pub),
    }
  }

  async step1(
    encryptedMessage1: string,
    remoteAuthPubHex: string
  ): Promise<string> {
    this.remoteAuthPubHex = Encryptor.decodeAuthPub(remoteAuthPubHex)
    const decryptedMessage1 = Encryptor.decryptBytes(
      this.localAuthPrivHex,
      this.remoteAuthPubHex,
      encryptedMessage1
    )
    const message2 = this.p2Ctx.step1(decryptedMessage1) as Uint8Array
    return await Encryptor.encryptBytes(
      this.localAuthPrivHex,
      this.remoteAuthPubHex,
      message2
    )
  }

  async step2(encryptedMessage3: string): Promise<string> {
    const decryptedMessage3 = Encryptor.decryptBytes(
      this.localAuthPrivHex,
      this.remoteAuthPubHex,
      encryptedMessage3
    )
    const ungzipMessage3 = pako.ungzip(decryptedMessage3)

    this.p2Ctx.step2(ungzipMessage3)
    return await Encryptor.encryptString(
      this.localAuthPrivHex,
      this.remoteAuthPubHex,
      DONE_MESSAGE
    )
  }

  exportKeyShare2(): JsonObject.JsonObject_KeyShare2 {
    const keyshare2 = this.p2Ctx.exportKeyShare()
    return keyshare2.toJsonObject()
  }
}

export default DKGP2
