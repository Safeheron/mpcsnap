import { lazy } from 'react'

import { RouterEnum } from '@/configs/Enums'

const routes = [
  {
    path: RouterEnum.home,
    element: lazy(() => import('@/views/home/Home')),
  },

  {
    path: RouterEnum.test,
    element: lazy(() => import('@/views/demo/DemoPage')),
  },
]

export default routes
