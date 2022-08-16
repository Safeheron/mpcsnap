import { isProd } from '../utils/env'
import { arrayFilterEmpty } from '../utils/helpers'

module.exports = () => {
  const plugins = arrayFilterEmpty([
    require('autoprefixer'),
    isProd ? require('cssnano') : null,
  ])
  return {
    plugins,
  }
}
