import React from 'react'
import Canvas from '@pages/Canvas'
import Theme from '@components/Theme/Theme'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

export const App = () => {
  return (
    <Theme theme="dark">
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Canvas />
          </Route>
        </Switch>
      </BrowserRouter>
    </Theme>
  )
}
