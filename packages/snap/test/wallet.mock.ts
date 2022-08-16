import sinon from "sinon"

import { Wallet } from "../src/interfaces"
import { testDefaultMpcSnapState } from './constants'

export class WalletMock implements Wallet {
  public readonly registerRpcMessageHandler = sinon.stub()

  public readonly requestStub = sinon.stub()

  public readonly rpcStubs = {
    snap_confirm: sinon.stub(),
    snap_getBip44Entropy_461: sinon.stub(),
    snap_manageState: sinon.stub(),
  }

  /**
   * Calls this.requestStub or this.rpcStubs[req.method], if the method has
   * a dedicated stub.
   */
  public request(args: { method: string, params: unknown[] }): unknown {
    const { method, params = [] } = args
    if (Object.hasOwnProperty.call(this.rpcStubs, method)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (this.rpcStubs as any)[method](...params)
    }
    return this.requestStub(args)
  }

  public reset(): void {
    this.registerRpcMessageHandler.reset()
    this.requestStub.reset()
    Object.values(this.rpcStubs).forEach(
      (stub: ReturnType<typeof sinon.stub>) => stub.reset()
    )
  }

  public prepareForKeyshard(): void {
    this.rpcStubs.snap_manageState
      .withArgs('get')
      .resolves(testDefaultMpcSnapState)
  }
}
