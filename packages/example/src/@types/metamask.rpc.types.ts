export interface WalletEnableResult {
  accounts: string[]
  permissions: Web3WalletPermission[]
  snaps: WalletInstallSnapsResult
  errors?: Error[]
}

export interface Web3WalletPermission {
  id: string
  date: number
  caveats: any
  invoker: string
  parentCapability: string
}

export interface WalletInstallSnapsResult {
  [snapId: string]: WalletGetSnapsResult[string] | { error: Error }
}

interface WalletGetSnapsResult {
  [snapId: string]: {
    id: string
    initialPermissions: string[]
    permissionName: string
    version: string
  }
}
