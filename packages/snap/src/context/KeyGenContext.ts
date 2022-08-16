import { DKGP1, KeyShare1JsonObject } from '@safeheron/two-party-mpc-adapter'

class KeyGenContext{

  private authPrivKey?: string
  private authPubKey?: string

  private pkOfKeystone?: string

  private readonly dkgCtx1: DKGP1

  private currentStep = 1
  private steps = [
    this.context.bind(this),
    this.step1.bind(this),
    this.step2.bind(this),
    this.step3.bind(this)
  ]

  constructor() {
    this.dkgCtx1 = new DKGP1()
    this.currentStep = 1
  }

  async next(...args: any[]): Promise<string | KeyShare1JsonObject>{
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

  public getAuthPriv(){
    return this.authPrivKey
  }

  public getAuthPub(){
    return this.authPubKey
  }

  public getPkOfKeystone(){
    return this.pkOfKeystone
  }

  private async context(){
    const { priv, pub } = await this.dkgCtx1.createContext()

    this.authPrivKey = priv
    this.authPubKey = pub

    return this.authPubKey
  }

  private async step1(pkOfKeystone: string): Promise<string>{
    if(!this.authPrivKey){
      return Promise.reject('No auth private key.')
    }
    if(!this.dkgCtx1){
      return Promise.reject('No MPC Context.')
    }
    this.pkOfKeystone = pkOfKeystone
    const encryptedMessage1 = await this.dkgCtx1.step1(pkOfKeystone)
    return Promise.resolve(encryptedMessage1)
  }

  private async step2(encryptedMessage2: string): Promise<string> {
    if(!this.dkgCtx1){
      return Promise.reject('No MPC Context.')
    }
    const encryptedMessage3 = await this.dkgCtx1.step2(encryptedMessage2)
    return Promise.resolve(encryptedMessage3)
  }

  private async step3(doneMessage: string): Promise<KeyShare1JsonObject> {
    if(!this.dkgCtx1){
      return Promise.reject('No MPC Context.')
    }

    const keyshare1 = this.dkgCtx1.step3(doneMessage)
    return Promise.resolve(keyshare1)
  }

}

export default KeyGenContext
