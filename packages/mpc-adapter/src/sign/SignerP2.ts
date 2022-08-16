import { TPCEcdsaSign } from '@safeheron/two-party-ecdsa-js'
import { P2Context } from '@safeheron/two-party-ecdsa-js/dist/lib/sign'

import Encryptor from '../enc/Encryptor'
import Signer from './Signer'

class SignerP2 extends Signer{

  p2Ctx: P2Context

  async step1(unsignedTx: string | Record<string, string | number>, encryptedMessage1: string): Promise<string>{
    const unsignedTxObject = typeof unsignedTx === 'string' ? JSON.parse(unsignedTx) : unsignedTx
    const message = this.serializeUnsignedTx(unsignedTxObject)
    this.p2Ctx = await TPCEcdsaSign.P2Context.createContext(this.keyshare, message)
    const decryptedMessage1 = Encryptor.decryptBytes(this.localAuthPriv, this.remoteAuthPub, encryptedMessage1)
    const message2 = this.p2Ctx.step1(decryptedMessage1)
    return await Encryptor.encryptBytes(this.localAuthPriv, this.remoteAuthPub, message2)
  }

  async step2(encryptedMessage3: string): Promise<string>{
    const decryptedMessage3 = Encryptor.decryptBytes(this.localAuthPriv, this.remoteAuthPub, encryptedMessage3)
    const message4 = this.p2Ctx.step2(decryptedMessage3)
    return await Encryptor.encryptBytes(this.localAuthPriv, this.remoteAuthPub, message4)
  }

}

export default SignerP2
