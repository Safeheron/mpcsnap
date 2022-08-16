# MPCSnap

MPCSnap enables MPC Wallet inside MetaMask.

## Snaps Introducion
For more about Snaps, please follow MetaMask Snaps guide [here](https://docs.metamask.io/guide/snaps.html).

## MPCSnap RPC Methods

### Account

- mpc_requestAccount

### Create Wallet

- mpc_createWalletContext
- mpc_createWalletStep1
- mpc_createWalletStep2
- mpc_createWalletStep3

### Signing

- mpc_signTransactionContext
- mpc_signTransactionStep1
- mpc_signTransactionStep2

### Wallet Management

- mpc_exportWalletKeyshard
- mpc_importWalletKeyshard
- mpc_deleteWallet
- mpc_queryBackupStatus

### Heartbeat

- mpc_snapKeepAlive


## Build

```
yarn run build
```

## Test MPCSnap

If you want to test `mpcsnap` locally, do:

```
yarn run serve
```
