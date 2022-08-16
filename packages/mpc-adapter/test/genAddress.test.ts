import {deriveAddressFromCurvePoint} from '../src'

describe('test genAddres from publick key point', ()=>{

  const x = 'a1be7ebf6b7cfe3c82df02937fdd45e75a876397325e4f86d8e77850b453d74'
  const y = '3041ec5158bba7155f4fa773a2a341f102cf0f65d97b78040e0f9e8328ee67f6'

  test('test genAddrss', ()=> {
    const address = deriveAddressFromCurvePoint(x, y)
    expect(address).toEqual('0x731b2df5aef3ab37d0221133a00873578a49c2d7')
  })

})
