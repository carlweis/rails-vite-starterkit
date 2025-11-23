import React from 'react'
import { ThemeProvider } from '../contexts/ThemeContext'
import Welcome from './Welcome'

function App() {
  return (
    <ThemeProvider>
      <Welcome />
    </ThemeProvider>
  )
}

export default App
