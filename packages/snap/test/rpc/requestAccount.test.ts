import { requestAccount } from '../../src/rpc/requestAccount'
import { testDefaultMpcSnapState } from '../constants'
import { WalletMock } from '../wallet.mock'

describe('[RPC] requestAccount', ()=>{

  const walletStub = new WalletMock()

  afterEach(()=>{
    walletStub.reset()
  })

  test('should return false on negative prompt confirmation', async() => {
    walletStub.prepareForKeyshard()
    walletStub.rpcStubs.snap_confirm.resolves(false)

    const result = await requestAccount(walletStub)

    expect(result).toEqual({ success: false, errMsg: 'User reject to connect' })
  })

  test('should return empty address if no wallet', async() => {
    walletStub.rpcStubs.snap_confirm.resolves(true)

    const result = await requestAccount(walletStub)

    expect(result.success).toBeTruthy()
    expect(result.address).toEqual('')
  })

  test('should return address if wallet exist and approve connect confirmation', async()=>{
    walletStub.prepareForKeyshard()
    walletStub.rpcStubs.snap_confirm.resolves(true)

    const result = await requestAccount(walletStub)

    expect(result.success).toBeTruthy()
    expect(result.address).toEqual(testDefaultMpcSnapState['2-2'].address)
  })

})
