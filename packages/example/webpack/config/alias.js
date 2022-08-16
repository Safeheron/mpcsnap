import { join } from 'path'

import { rootDir } from '../utils/env'

export const aliasItems = {
  '@': join(rootDir, '/src'),
  '@img': join(rootDir, '/src/images'),
  '@styles': join(rootDir, '/src/styles'),
  '@components': join(rootDir, '/src/components'),
}
