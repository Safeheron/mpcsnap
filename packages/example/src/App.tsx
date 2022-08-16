import { FC, Suspense } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'

import routes from '@/routes'
import { stylesContainer } from '@/styles/app/app.module.less'

const App: FC = () => (
  <Router>
    <Suspense fallback={<div />}>
      <div className={stylesContainer}>
        <Routes>
          {routes.map((route: any) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Routes>
      </div>
    </Suspense>
  </Router>
)
export default App
