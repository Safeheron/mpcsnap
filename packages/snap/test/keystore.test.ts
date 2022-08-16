import { decrypt,encrypt } from '../src/utils/keystore'
import { testDefaultMpcSnapState } from './constants'

describe('keystore', ()=>{

  test('encrypt and decrypt keyshare1', async()=>{
    const password = '12345678'

    const keystoreJson = encrypt(password, testDefaultMpcSnapState['2-2'])
    console.log('keystoreJson:\n', keystoreJson)

    const data = decrypt(password, keystoreJson)
    console.log('decryptedData: \n', data)

    expect(data.address).toEqual(testDefaultMpcSnapState['2-2'].address)
  })

})
