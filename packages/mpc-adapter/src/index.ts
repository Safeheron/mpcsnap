import { Rand } from '@safeheron/crypto-rand'
import { TPCEcdsaSign } from '@safeheron/two-party-ecdsa-js'
import { KeyShare1, KeyShare2 } from '@safeheron/two-party-ecdsa-js/dist/lib/keyGen'
import { JsonObject } from '@safeheron/two-party-ecdsa-js/dist/lib/keyGen/jsonObject'

export type KeyShare1JsonObject = JsonObject.JsonObject_KeyShare1
export type KeyShare2JsonObject = JsonObject.JsonObject_KeyShare2

import Encryptor from './enc/Encryptor'
import DKGP1 from './keygen/DKGP1'
import DKGP2 from './keygen/DKGP2'
import SignerP1 from './sign/SignerP1'
import SignerP2 from './sign/SignerP2'
import { deriveAddressFromCurvePoint } from './utils'

export {
  deriveAddressFromCurvePoint,
  DKGP1,
  DKGP2,
  Encryptor,
  JsonObject,
  KeyShare1,
  KeyShare2,
  Rand,
  SignerP1,
  SignerP2,
  TPCEcdsaSign}

