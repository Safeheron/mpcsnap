import { ethers } from 'ethers'

export { ethers }

export const provider = window.ethereum
  ? new ethers.providers.Web3Provider(window.ethereum)
  : null

export const wei2eth = (num: string): string => {
  const eth = ethers.utils.formatEther(num)
  return (+eth).toFixed(4)
}

export const hexToString = (hexString: string): string => {
  return ethers.utils.toUtf8String(ethers.utils.hexlify(hexString))
}

export const stringToHex = (utf8String: string): string => {
  if (!utf8String) return ''
  if (ethers.utils.isHexString(utf8String)) return utf8String
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(utf8String))
}

export async function isMetaMaskSnapsSupported() {
  try {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      return false
    }
    await window.ethereum.request({
      method: 'wallet_getSnaps',
    })
    return true
  } catch (e) {
    return false
  }
}
