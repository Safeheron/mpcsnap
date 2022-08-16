import { splitSignature } from '@ethersproject/bytes'
import { TPCEcdsaSign } from '@safeheron/two-party-ecdsa-js'
import { P1Context } from '@safeheron/two-party-ecdsa-js/dist/lib/sign'
import { ethers } from 'ethers'

import Encryptor from '../enc/Encryptor'
import Signer from './Signer'

class SignerP1 extends Signer{

  p1Ctx: P1Context

  async createContext(unsignedTx: Record<string, string | number>){
    const message = this.serializeUnsignedTx(unsignedTx)
    this.p1Ctx = await TPCEcdsaSign.P1Context.createContext(this.keyshare, message)
  }

  async step1(): Promise<string>{
    const message1 = this.p1Ctx.step1() as Uint8Array
    return await Encryptor.encryptBytes(this.localAuthPriv, this.remoteAuthPub, message1)
  }

  async step2(encryptedMessage2: string): Promise<string> {
    const decryptedMessage2 = Encryptor.decryptBytes(this.localAuthPriv, this.remoteAuthPub, encryptedMessage2)
    const message3Buf = this.p1Ctx.step2(decryptedMessage2)
    return await Encryptor.encryptBytes(this.localAuthPriv, this.remoteAuthPub, message3Buf)
  }

  async step3(encryptedMessage4: string): Promise<void> {
    const decryptedMessage4 = Encryptor.decryptBytes(this.localAuthPriv, this.remoteAuthPub, encryptedMessage4)
    this.p1Ctx.step3(decryptedMessage4)
  }

  private padHexPrefix(value: string){
    return ethers.utils.isHexString(value) ? value : '0x' + value
  }

  exportRawTx(): string{
    const [r, s, v] =  this.p1Ctx.exportSig()
    const signature = {
      r: this.padHexPrefix(r.toString(16)),
      s: this.padHexPrefix(s.toString(16)),
      recoveryParam: v
    }
    const finalSignature = splitSignature(signature)
    return ethers.utils.serializeTransaction(this.unsignedTx, finalSignature)
  }

}

export default SignerP1
