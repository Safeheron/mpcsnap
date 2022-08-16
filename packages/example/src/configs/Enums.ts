export enum RouterEnum {
  home = '/',
  test = '/demo',
}

export enum ChainIdEnum {
  Main = '0x1',
  Ropsten = '0x3',
  Rinkeby = '0x4',
  Goerli = '0x5',
  Kovan = '0x2a',
}

export const ChainIdMap = {
  [ChainIdEnum.Main]: 'Ethereum Main Network',
  [ChainIdEnum.Ropsten]: 'Ropsten Test Network',
  [ChainIdEnum.Rinkeby]: 'Rinkeby Test Network',
  [ChainIdEnum.Goerli]: 'Goerli Test Network',
  [ChainIdEnum.Kovan]: 'Kovan Test Network',
}

export enum SnapInvokeMethods {
  heartBeat = 'mpc_snapKeepAlive',
  requestAccount = 'mpc_requestAccount',

  createWalletContext = 'mpc_createWalletContext',
  createWalletStep1 = 'mpc_createWalletStep1',
  createWalletStep2 = 'mpc_createWalletStep2',
  createWalletStep3 = 'mpc_createWalletStep3',

  importWalletKeyshard = 'mpc_importWalletKeyshard',
  exportWalletKeyShard = 'mpc_exportWalletKeyshard',

  signTransactionContext = 'mpc_signTransactionContext',
  signTransactionStep1 = 'mpc_signTransactionStep1',
  signTransactionStep2 = 'mpc_signTransactionStep2',

  deleteWallet = 'mpc_deleteWallet',
  queryBackupStatus = 'mpc_queryBackupStatus',
}
