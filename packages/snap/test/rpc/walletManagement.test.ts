import { MPCKeystoreJSONObject } from '@safeheron/mpcsnap-types'

import { deleteWallet, exportKeyshard, importKeyshard, queryBackupStatus } from '../../src/rpc/walletManage'
import { encrypt } from '../../src/utils/keystore'
import { testDefaultMpcSnapState, testExportedKeystore, testSignKeyshare2 } from '../constants'
import { WalletMock } from '../wallet.mock'

const password = '123456'

describe('[RPC] walletManagement', ()=>{

  const walletStub = new WalletMock()

  describe('test export wallet', ()=>{
    afterEach(()=>{
      walletStub.reset()
    })
    test('should return "no matched keyshard" when snap has not store the keyshard', async()=>{
      const result = await exportKeyshard(walletStub, password)
      expect(result).toEqual({ success: false, errMsg: 'No matched keyshard' })
    })

    test('should not return keyshard on negative prompt confirmation', async()=>{
      walletStub.prepareForKeyshard()
      walletStub.rpcStubs.snap_confirm.resolves(false)

      const result = await exportKeyshard(walletStub, password)
      expect(result).toEqual({ success: false, errMsg: 'User reject to export!' })
    })

    test('should return encrypted keyshard on positive prompt confirmation', async()=>{
      walletStub.prepareForKeyshard()
      walletStub.rpcStubs.snap_confirm.resolves(true)

      const result = await exportKeyshard(walletStub, password)

      expect(result.success).toBeTruthy()

      const parsedKeystore = JSON.parse(result.keystore) as MPCKeystoreJSONObject

      expect(parsedKeystore.address).toEqual(testExportedKeystore.address)
      expect(parsedKeystore.Crypto.cipher).toEqual('aes-128-ctr')
      expect(parsedKeystore.Crypto.kdf).toEqual('scrypt')
      expect(parsedKeystore.Crypto.kdfparams.n).toBe(65536)

    })
  })

  describe('test import wallet', ()=>{
    afterEach(()=>{ walletStub.reset() })

    test('should return keyshard exists', async()=>{
      walletStub.prepareForKeyshard()

      const result = await importKeyshard(walletStub, JSON.stringify(testExportedKeystore), password)

      expect(result).toEqual({success: false, errMsg: 'Keyshard exists! cannot import' })
    })

    test('should return incorrect password', async()=>{
      const wrongPassword = password + 'wrong'

      const result = await importKeyshard(walletStub, JSON.stringify(testExportedKeystore), wrongPassword)

      expect(result).toEqual({ success: false, errMsg: 'Failed to decrypt. Please ensure password and keystore are correct.' })
    })

    test('should return false on attempt to import keyshare2', async()=>{
      const mpcStateForKeyshare1 = Object.assign({}, testDefaultMpcSnapState['2-2'])
      mpcStateForKeyshare1.keyshard = testSignKeyshare2
      const encryptedKeyshare2Keystore = encrypt(password, mpcStateForKeyshare1)
      const result = await importKeyshard(walletStub, JSON.stringify(encryptedKeyshare2Keystore), password)
      expect(result.success).toBeFalsy()
    })

    test('should return import success', async()=>{
      const result = await importKeyshard(walletStub, JSON.stringify(testExportedKeystore), password)
      expect(result.success).toBeTruthy()
    })
  })

  describe('test query Backup status', ()=>{
    afterEach(()=>{
      walletStub.reset()
    })

    test('should return false when snap didn\'t store any wallet', async()=>{
      const result = await queryBackupStatus(walletStub)
      expect(result.success).toBeTruthy()
      expect(result.backuped).toBeFalsy()
    })

    test('should return backuped state', async()=>{
      walletStub.prepareForKeyshard()
      const result = await queryBackupStatus(walletStub)
      expect(result.success).toBeTruthy()
      expect(result.backuped).toEqual(testDefaultMpcSnapState['2-2'].backuped)
    })

  })

  describe('test delete wallet', ()=>{
    afterEach(()=>{ walletStub.reset() })

    test('should return false on empty wallet', async()=>{
      const result = await deleteWallet(walletStub)

      expect(result.success).toBeFalsy()
      expect(result).toEqual({ success: false, errMsg: 'Wallet not exists! ' })
    })

    test('should return false on negative confirmation', async()=>{
      walletStub.prepareForKeyshard()
      walletStub.rpcStubs.snap_confirm.resolves(false)

      const result = await deleteWallet(walletStub)

      expect(result.success).toBeFalsy()
      expect(result).toEqual({ success: false, errMsg: 'User reject to Delete!' })
    })

    test('should return success', async()=>{
      walletStub.prepareForKeyshard()
      walletStub.rpcStubs.snap_confirm.resolves(true)

      const result = await deleteWallet(walletStub)

      expect(result.success).toBeTruthy()
    })

  })

})
