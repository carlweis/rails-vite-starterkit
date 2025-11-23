import React from 'react'
import { ThemeProvider } from '../contexts/ThemeContext'
import { Button } from './ui/button'
import Example from './Example'

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <ThemeProvider>
      <Example />
    </ThemeProvider>
  )
}

export default App
