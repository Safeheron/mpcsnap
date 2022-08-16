import { TransactionObject } from '@safeheron/mpcsnap-types'
import { KeyShare1JsonObject, SignerP1 } from '@safeheron/two-party-mpc-adapter'

class SignContext{

  private signerP1?: SignerP1

  private currentStep = 1
  private unsignedTx?: TransactionObject

  constructor() {
    this.currentStep = 1
  }

  private steps = [
    this.createContext.bind(this),
    this.step1.bind(this),
    this.step2.bind(this)
  ]
  async next(...args: any[]): Promise<string>{
    const currentFn = this.steps[this.currentStep - 1]
    if(!currentFn){
      return Promise.reject('Illegal State')
    }
    try {
      //@ts-ignore
      const res = await currentFn(...args)
      this.currentStep++
      return res
    } catch (e) {
      throw e
    }
  }

  private async createContext(
    keyshare1: KeyShare1JsonObject,
    unsignedTx: TransactionObject,
    authPriv: string,
    remotePub: string
  ): Promise<string> {
    this.unsignedTx = unsignedTx

    this.signerP1 = new SignerP1(keyshare1, authPriv, remotePub)

    await this.signerP1.createContext(unsignedTx as any)
    return await this.signerP1.step1()
  }

  private async step1(encryptedMessage2: string): Promise<string> {
    if(!this.signerP1){
      return Promise.reject('No MPCContext!')
    }
    return await this.signerP1.step2(encryptedMessage2)
  }

  private async step2(encryptedMessage4: string): Promise<string>{
    if(!this.signerP1){
      return Promise.reject('No MPCContext!')
    }
    await this.signerP1.step3(encryptedMessage4)
    return this.signerP1.exportRawTx()
  }

}

export default SignContext
