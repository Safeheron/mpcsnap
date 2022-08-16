export const devServerConfig = {
  allowedHosts: 'all',
  client: {
    overlay: false,
  },
  headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: true,
  hot: true,
  static: {
    publicPath: '/',
  },
}
