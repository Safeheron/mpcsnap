import { Prime,Rand } from '@safeheron/crypto-rand'
import BN from 'bn.js'

import Command from '../assembly/Command'

const command = new Command()

/**
 * We use openssl prime to generate random numbers because
 * the javascript implementation of the isProbablyPrime function runs too slowly in snap,
 * generating two random 256-byte primes that exceed 60s most of the time
 *
 * @param {number} byteSize
 */
async function getRandomPrimeBN(byteSize: number){
  const hexString = await command.run(
    `prime -generate -bits ${byteSize * 8} -hex`
  )
  console.log('use openssl wasm generate random prime value: ', byteSize, hexString)
  return new BN(hexString, 16)
}

async function randomByOpensslWasm(byteSize: number) {
  while (true){
    const primeBN = await getRandomPrimeBN(byteSize)
    if(Prime.isProbablyPrime(primeBN)){
      return primeBN
    }
  }
}

Rand.config_randomPrimeImp(randomByOpensslWasm)
