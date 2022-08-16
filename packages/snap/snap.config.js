module.exports = {
  cliOptions: {
    src: './src/index.ts',
    port: 3000,
  },
  bundlerCustomizer: bundler => {
    bundler.transform('brfs')
  },
}
