import Encryptor from '../src/enc/Encryptor'

describe('authEnc', ()=>{

  test('generateKeyPaire', async()=>{
    const keyPair = await Encryptor.generateKeyPaire()

    expect(keyPair).toContain('priv')
    expect(keyPair).toContain('pub')
  })

  test('encryptBytes', async()=>{

    const keyPairA = await Encryptor.generateKeyPaire()
    const keyPairB = await Encryptor.generateKeyPaire()

    const data = new Uint8Array(new Array(5000).fill(1))

    const cypherData = await Encryptor.encryptBytes(keyPairA.priv, keyPairB.pub, data)

    const plain = Encryptor.decryptBytes(keyPairB.priv, keyPairA.pub, cypherData)

    expect(plain).toEqual(data)
  })

  test('encryptString', async()=>{
    const keyPairA = await Encryptor.generateKeyPaire()
    const keyPairB = await Encryptor.generateKeyPaire()

    const data = 'Hello World!'

    const cypherData = await Encryptor.encryptString(keyPairA.priv, keyPairB.pub, data)
    const plain = Encryptor.decryptString(keyPairB.priv, keyPairA.pub, cypherData)

    expect(plain).toEqual(data)
  })

})
