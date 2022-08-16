export const DONE_MESSAGE = 'DONE'

const CryptoJS = require('crypto-js')

export function deriveAddressFromCurvePoint(x: string, y: string) {
  // eslint-disable-next-line no-param-reassign
  x = x.padStart(64, '0')
  // eslint-disable-next-line no-param-reassign
  y = y.padStart(64, '0')

  const sub = `${x}${y}`
  const wordArray = CryptoJS.enc.Hex.parse(sub)
  const publicKey = CryptoJS.SHA3(wordArray, { outputLength: 256 })
  const hash = publicKey.toString().slice(-40)

  return `0x${hash}`
}


