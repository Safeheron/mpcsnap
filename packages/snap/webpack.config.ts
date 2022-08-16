import SnapsWebpackPlugin from '@metamask/snaps-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import path from 'path'
import webpack, { Configuration } from 'webpack'

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const HookShellScriptWebpackPlugin = require('hook-shell-script-webpack-plugin')

const config: Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mpcSnapBundle.js',
    publicPath: './dist',
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.ts', '...'],
    alias: {
      process: 'process/browser',
      '@safeheron/crypto-rand': path.resolve(__dirname, '../../node_modules/@safeheron/crypto-rand/dist/index.js')
      // "@safeheron/crypto-paillier": path.resolve(__dirname, '../../../crypto-paillier-js/index.ts'),
      // '@safeheron/crypto-rand': path.resolve(__dirname, '../../../crypto-rand-js/index.ts')
    },
    fallback: {
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    },
  },
  experiments: {
    syncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'webassembly-loader',
            options: {
              export: 'buffer',
            },
          },
        ],
      },
      {
        test: /\.(m?js|ts)x?$/u,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
        // exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new SnapsWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
    new HookShellScriptWebpackPlugin({
      afterEmit: ['npm run manifest', 'npm run eval'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  watchOptions: {
    ignored: ['**/snap.manifest.json'],
  },
}

export default config
