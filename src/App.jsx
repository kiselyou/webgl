import React from 'react'
import PageRoot from '@pages/PageRoot'
import PageFire from '@pages/PageFire'
import PageGame from '@pages/PageGame'
import PagePath from '@pages/PagePath'
import Theme from '@components/Theme/Theme'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export const App = () => {
  return (
    <Theme theme="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageRoot />} />
          <Route path="/game" element={<PageGame />} />
          <Route path="/fire" element={<PageFire />} />
          <Route path="/path" element={<PagePath />} />
        </Routes>

      </BrowserRouter>
    </Theme>
  )
}
