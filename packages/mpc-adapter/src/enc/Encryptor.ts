import {AuthEnc} from '@safeheron/crypto-ecies'
import { Rand } from '@safeheron/crypto-rand'
import BN from 'bn.js'
import * as elliptic from 'elliptic'
import { curve } from 'elliptic'

export type PubCurveBasePoint = curve.base.BasePoint

const P256 = new elliptic.ec('p256')
class Encryptor {

  static async generateKeyPaire(): Promise<{ priv: BN; pub: PubCurveBasePoint; }>{
    const authPriv = await Rand.randomBN(32)
    const authPub = P256.g.mul(authPriv) as PubCurveBasePoint

    return {
      priv: authPriv,
      pub: authPub
    }
  }

  static encodeAuthPriv(authPriv: BN): string {
    return authPriv.toString(16, 64)
  }

  static decodeAuthPriv(authPrivHexString: string): BN{
    return new BN(authPrivHexString, 16)
  }

  static encodeAuthPub(authPubPoint: PubCurveBasePoint): string {
    const x = authPubPoint.getX().toString(16)
    const y = authPubPoint.getY().toString(16)
    return `04${x.padStart(64, '0')}${y.padStart(64, '0')}`
  }

  static decodeAuthPub(authPubStr: string): PubCurveBasePoint {
    if(authPubStr.startsWith('04') && authPubStr.length === 130){
      const x = authPubStr.substring(2, 66)
      const y = authPubStr.substring(66, 130)
      return P256.curve.pointFromJSON([new BN(x, 16), new BN(y, 16)])
    }else{
      throw new Error('invalid public key string.')
    }
  }

  private static transformAuthPriv(localAuthPriv: string | BN): BN{
    return typeof localAuthPriv === 'string' ? this.decodeAuthPriv(localAuthPriv) : localAuthPriv
  }

  private static transformAuthPub(remoteAuthPub: string | PubCurveBasePoint): PubCurveBasePoint{
    return typeof remoteAuthPub === 'string' ? this.decodeAuthPub(remoteAuthPub) : remoteAuthPub
  }

  static encryptBytes(localAuthPriv: string | BN, remoteAuthPub: string | PubCurveBasePoint, plain: Uint8Array): Promise<string> {
    const localAuthPrivBN = this.transformAuthPriv(localAuthPriv)
    const remoteAuthPubPoint = this.transformAuthPub(remoteAuthPub)
    return AuthEnc.encryptBytes(localAuthPrivBN, remoteAuthPubPoint, plain)
  }

  static decryptBytes(localAuthPriv: string | BN, remoteAuthPub: string | PubCurveBasePoint, cypher: string): Uint8Array{
    const localAuthPrivBN = this.transformAuthPriv(localAuthPriv)
    const remoteAuthPubPoint = this.transformAuthPub(remoteAuthPub)
    const decryptResult = AuthEnc.decryptBytes(localAuthPrivBN, remoteAuthPubPoint, cypher)
    if(decryptResult[0] === true){
      return decryptResult[1]
    }else{
      throw new Error('Decrypt failed. Invalid pubHex or privHex or cypher.')
    }
  }

  static encryptString(localAuthPriv: string | BN, remoteAuthPub: string | PubCurveBasePoint, plain: string): Promise<string> {
    const localAuthPrivBN = this.transformAuthPriv(localAuthPriv)
    const remoteAuthPubPoint = this.transformAuthPub(remoteAuthPub)
    return AuthEnc.encryptString(localAuthPrivBN, remoteAuthPubPoint, plain)
  }

  static decryptString(localAuthPriv: string | BN, remoteAuthPub: string | PubCurveBasePoint, cypher: string): string{
    const localAuthPrivBN = this.transformAuthPriv(localAuthPriv)
    const remoteAuthPubPoint = this.transformAuthPub(remoteAuthPub)
    const decryptResult = AuthEnc.decryptString(localAuthPrivBN, remoteAuthPubPoint, cypher)
    if(decryptResult[0] === true){
      return decryptResult[1]
    }else{
      throw new Error('Decrypt failed. Invalid pubHex or privHex or cypher.')
    }
  }

}

export default Encryptor
