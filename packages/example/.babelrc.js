module.exports = api => {
  const mode = process.env.NODE_ENV ?? 'production'

  // This caches the Babel config by environment.
  api.cache.using(() => mode)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['>1%', 'last 4 versions', 'not ie < 9'],
          },
          useBuiltIns: 'usage',
          debug: false,
          corejs: 3,
        },
      ],
      '@babel/preset-typescript',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/proposal-object-rest-spread',
      '@babel/plugin-transform-modules-commonjs',

      // Applies the react-refresh Babel plugin on non-production modes only
      mode !== 'production' && ['react-refresh/babel', { skipEnvCheck: true }],
    ].filter(Boolean),
  }
}
