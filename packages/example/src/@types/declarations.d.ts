declare module '*.scss' {
  const content: { [className: string]: string }
  export = content
}

declare module '*.less' {
  const content: { [className: string]: string }
  export = content
}

declare module '*.json' {
  const content: Record<string, string>
  export default content
}

declare const IS_PROD: boolean
declare const IS_DEV: boolean
declare const IS_DEV_SERVER: boolean

export interface SnapRpcMethodRequest {
  method: string
  params: []
}

declare global {
  interface Window {
    ethereum?: {
      isConnected: () => boolean
      isMetaMask?: boolean
      isUnlocked: Promise<boolean>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: <T>(
        request: SnapRpcMethodRequest | { method: string; params?: any[] }
      ) => Promise<T>
      on: (eventName: unknown, callback: unknown) => unknown
    }
  }
}
