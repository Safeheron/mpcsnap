import { SignerP2 } from '@safeheron/two-party-mpc-adapter'
import { exec } from 'child_process'
import { ethers } from 'ethers'

import { signTransactionContext, signTransactionStep1, signTransactionStep2 } from '../../src/rpc/sendTransaction'
import { keypair1, keypair2, testAddress, testSignKeyshare2 } from '../constants'
import { WalletMock } from '../wallet.mock'

describe('[RPC] SignTransaction', ()=>{

  const txObject = {
    nonce: 0,
    to: "0x83682797C5165878a17EBfB6DE7cd7F528033130",
    value: '0.00001',
    chainId: 3,
    data: '',
    maxFeePerGas: '100',
    maxPriorityFeePerGas: '1000',
    gasLimit: 20000
  }

  const walletStub = new WalletMock()
  afterAll(()=>{
    walletStub.reset()
  })

  describe('Should signed success', ()=>{

    let message1: string
    let message3: string
    let signerP2: SignerP2

    test('create context', async()=>{
      walletStub.rpcStubs.snap_confirm.resolves(true)
      walletStub.prepareForKeyshard()

      const result = await signTransactionContext(walletStub, txObject)
      expect(result.success).toBeTruthy()

      message1 = result.message1
    })

    test('step1', async() => {
      signerP2 = new SignerP2(testSignKeyshare2, keypair2.priv, keypair1.pub)
      const message2 = await signerP2.step1(txObject, message1)

      const result = await signTransactionStep1(walletStub, message2)
      expect(result.success).toBeTruthy()
      message3 = result.message3
    })

    test('step2', async() => {
      const message4 = await signerP2.step2(message3)
      const result = await signTransactionStep2(walletStub, message4)

      expect(result.success).toBeTruthy()

      const signedRawTransaction = result.signedRawTransaction
      console.log(result.signedRawTransaction)

      const parsedTxData = ethers.utils.parseTransaction(signedRawTransaction)

      expect(parsedTxData.to.toUpperCase()).toEqual(txObject.to.toUpperCase())
      expect(parsedTxData.from.toUpperCase()).toEqual(testAddress.toUpperCase())

    })

  })

  describe('Should signed failed', () => {

    test('Should create sign context failed on negative prompt confimation', async()=>{
      walletStub.rpcStubs.snap_confirm.resolves(false)
      const result = await signTransactionContext(walletStub, txObject)
      expect(result.success).toBeFalsy()
    })

    test('Should step1 failed on skip create context', async()=>{
      const result = await signTransactionStep1(walletStub, 'some wrong message2')
      expect(result.success).toBeFalsy()
    })

    test('Should step2 faild on skip steps that before step2', async()=>{
      const result = await signTransactionStep2(walletStub, 'some wrong message3')
      expect(result.success).toBeFalsy()
    })
  })
})
