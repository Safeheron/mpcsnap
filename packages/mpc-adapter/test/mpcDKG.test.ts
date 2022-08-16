import DKGP1 from '../src/keygen/DKGP1'
import DKGP2 from '../src/keygen/DKGP2'

describe('DKG test', () => {
  test('genKey', async () => {
    console.time('Key Generation')
    const dkg1 = new DKGP1()
    const dkg2 = new DKGP2()

    try {
      const { priv: priv1, pub: pub1 } = await dkg1.createContext()

      const { priv: priv2, pub: pub2 } = await dkg2.createContext()

      const message1 = await dkg1.step1(pub2)
      console.log(message1.length)

      const message2 = await dkg2.step1(message1, pub1)
      console.log(message2.length)
      const message3 = await dkg1.step2(message2)
      console.log(message3.length)
      const doneMessage = await dkg2.step2(message3)
      console.log(doneMessage.length)
      const keyShare1 = dkg1.step3(doneMessage)

      const keyShare2 = dkg2.exportKeyShare2()

      expect(keyShare1.Q).toEqual(keyShare2.Q)

    } catch (e) {
      console.error(e)
      throw e
    }
    console.timeEnd('Key Generation')
  })
})
