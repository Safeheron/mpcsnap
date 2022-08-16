import { ethers } from 'ethers'

import { hexToString, stringToHex, wei2eth } from '../src/utils'

describe('wei2eth', () => {
  test('normal', async () => {
    const target = ethers.utils.parseEther('123.123').toString()
    expect(wei2eth(target)).toBe('123.1230')
  })

  test('large', async () => {
    const target = ethers.utils.parseEther('155115151.65665111').toString()
    expect(wei2eth(target)).toBe('155115151.6567')
  })

  test('little', async () => {
    const target = ethers.utils.parseEther('0.001234').toString()
    expect(wei2eth(target)).toBe('0.0012')
  })
})

describe('hexToString', () => {
  test('text', async () => {
    const target = 'hello'
    const result = hexToString(`0x${Buffer.from(target).toString('hex')}`)
    expect(result).toBe(target)
  })
  test('number', async () => {
    const target = '123456'
    const result = hexToString(`0x${Buffer.from(target).toString('hex')}`)
    expect(result).toBe(target)
  })
  test('chinese', async () => {
    const target = '你好'
    const result = hexToString(`0x${Buffer.from(target).toString('hex')}`)
    expect(result).toBe(target)
  })
})

describe('stringToHex', () => {
  test('text', async () => {
    const target = 'hello'
    const result = stringToHex(target)
    expect(result).toBe(`0x${Buffer.from(target).toString('hex')}`)
  })
  test('number', async () => {
    const target = '123456'
    const result = stringToHex(target)
    expect(result).toBe(`0x${Buffer.from(target).toString('hex')}`)
  })
  test('chinese', async () => {
    const target = '你好'
    const result = stringToHex(target)
    expect(result).toBe(`0x${Buffer.from(target).toString('hex')}`)
  })
})
