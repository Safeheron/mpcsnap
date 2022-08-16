import { deriveAddressFromCurvePoint, KeyShare2JsonObject } from '@safeheron/two-party-mpc-adapter'
import { DKGP2 } from '@safeheron/two-party-mpc-adapter'

import {
  createWalletContext,
  createWalletStep1,
  createWalletStep2,
  createWalletStep3
} from '../../src/rpc/createWallet'
import { queryBackupStatus } from '../../src/rpc/walletManage'
import { WalletMock } from '../wallet.mock'


describe('[RPC] CreateWallet should success', ()=>{
  const walletStub = new WalletMock()
  afterAll(()=>{
    walletStub.reset()
  })

  let message1: string
  let message3: string
  let authPrivOfP2: string
  let authPubOfP2: string
  let authPubOfP1: string
  let dkgp2: DKGP2

  test('create context', async() => {
    walletStub.rpcStubs.snap_confirm.resolves(true)

    const result = await createWalletContext(walletStub)

    expect(result.success).toBeTruthy()
  })

  test('create step1', async()=>{
    dkgp2 = new DKGP2()
    const {priv, pub} = await dkgp2.createContext()
    authPrivOfP2 = priv
    authPubOfP2 = pub

    const result = await createWalletStep1(walletStub, authPubOfP2)

    expect(result.success).toBeTruthy()
    message1 = result.message1
    authPubOfP1 = result.publicKey
  })

  test('create step2', async()=>{
    const message2 = await dkgp2.step1(message1, authPubOfP1)

    const result = await createWalletStep2(walletStub, message2)

    expect(result.success).toBeTruthy()
    message3 = result.message3
  })

  test('create step3', async()=>{
    const doneMessage = await dkgp2.step2(message3)
    const keyShare2 = dkgp2.exportKeyShare2() as KeyShare2JsonObject

    const q2 = keyShare2.Q
    const addressDerivedFromQ2 = deriveAddressFromCurvePoint(q2.x, q2.y)

    const result = await createWalletStep3(walletStub, doneMessage)
    expect(result.success).toBeTruthy()
    expect(result.address).toEqual(addressDerivedFromQ2)
  })

})


describe('[RPC] CreateWallet should be failed', () => {

  const walletStub = new WalletMock()
  afterAll(()=>{
    walletStub.reset()
  })

  test('Should create context failed on negative prompt confimation', async()=>{
    walletStub.rpcStubs.snap_confirm.resolves(false)
    const result = await createWalletContext(walletStub)
    expect(result.success).toBeFalsy()
  })

  test('Should step1 failed on skip create context', async()=>{
    const dkgp2 = new DKGP2()
    const {priv, pub} = await dkgp2.createContext()
    const result = await createWalletStep1(walletStub, priv)
    expect(result.success).toBeFalsy()
  })

  test('Should step2 failed on skip steps before step2', async()=>{
    const result = await createWalletStep2(walletStub, 'some wrong message')
    expect(result.success).toBeFalsy()
  })

  test('Should step3 failed on skip steps before step3', async()=>{
    const result = await createWalletStep3(walletStub, 'some wrong done message')
    expect(result.success).toBeFalsy()
  })

})
