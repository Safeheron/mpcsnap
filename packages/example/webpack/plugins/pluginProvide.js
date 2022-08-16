import { ProvidePlugin } from 'webpack'

const config = {
  Buffer: ['buffer', 'Buffer'],
}

export const providePlugin = new ProvidePlugin(config)
