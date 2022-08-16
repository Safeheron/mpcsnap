import { JsonRpcId, JsonRpcVersion } from '@metamask/types/src/json-rpc'
import { MetamaskSnapMpcSnapRequest } from '@safeheron/mpcsnap-types'
import { KeyShare1JsonObject } from '@safeheron/two-party-mpc-adapter'

export interface Wallet {
  request(options: { method: string; params?: unknown[] }): unknown;
}

export type MPCSnapRpcHandler = (args: {
  origin: string;
  request: MetamaskSnapMpcSnapRequest & {jsonrpc: JsonRpcVersion; id: JsonRpcId;}
}) => Promise<unknown>

export interface MPCSnapState{
  '2-2': {
    address: string;
    keyshard?: KeyShare1JsonObject;
    pkOfKeystone: string;
    authPriv: string;
    authPub: string;
    backuped: boolean;
  }
}

export const getEmptyMPCSnapState: ()=>MPCSnapState = ()=>{
  return {
    '2-2': {
      address: '',
      pkOfKeystone: '',
      authPriv: '',
      authPub: '',
      backuped: false
    }
  }
}

export interface SignatureByMPC {
  r: string;
  s: string;
  v: number
}

