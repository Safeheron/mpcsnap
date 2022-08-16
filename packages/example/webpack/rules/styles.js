import { arrayFilterEmpty } from '../utils/helpers'

import {
  cssLoader,
  cssLoaderItems,
  cssModulesSupportLoaderItems,
  lessLoader,
  miniCssExtractLoader,
  postCssLoader,
  resolveUrlLoader,
} from './useLoaderRuleItems'

/** css * */
export const cssRule = {
  test: /\.css$/,
  use: [miniCssExtractLoader, cssLoader, postCssLoader],
}

/** less * */
export const lessModulesRule = {
  test: /\.module.less$/,
  use: arrayFilterEmpty([
    ...cssModulesSupportLoaderItems,
    postCssLoader,
    resolveUrlLoader,
    lessLoader,
  ]),
}
export const lessRule = {
  test: /\.less$/,
  exclude: /\.module.less$/,
  use: arrayFilterEmpty([
    ...cssLoaderItems,
    postCssLoader,
    resolveUrlLoader,
    lessLoader,
  ]),
}

export const lessRules = [lessModulesRule, lessRule]
