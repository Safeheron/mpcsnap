import { GetAccountResponse } from '@safeheron/mpcsnap-types'

import { MPCSnapState, Wallet } from '../interfaces'
import { showConfirmationDialog } from '../utils/confirmation'

export async function requestAccount(wallet: Wallet): Promise<GetAccountResponse>{
  const state = (await wallet.request({ method: 'snap_manageState', params: ['get'] })) as MPCSnapState

  if(state && state['2-2'] && state['2-2'].keyshard && state['2-2'].address){
    const address = state['2-2'].address
    const confirmation = await showConfirmationDialog(
      wallet,
      {
        prompt: 'Connect With MPCSnap',
        textAreaContent: `
        Address:
        ${address}
      `
      }
    )
    if(confirmation){
      return Promise.resolve({ success: true, address })
    }else{
      return Promise.resolve({ success: false, errMsg: 'User reject to connect' })
    }

  } else {
    return Promise.resolve({ success: true, address: '' })
  }
}
