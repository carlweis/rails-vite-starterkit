import React from 'react'
import { Button } from './ui/button'

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-xl p-8 border">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Rails + Vite + React!
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            This is a modern Rails 8 starter kit with Vite, TypeScript, React, Tailwind CSS, and Shadcn UI.
          </p>

          <div className="bg-primary text-primary-foreground rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-3">Tech Stack</h2>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Ruby on Rails 8</li>
              <li>Vite (Lightning-fast build tool)</li>
              <li>TypeScript</li>
              <li>React 18</li>
              <li>Tailwind CSS v3</li>
              <li>Shadcn UI Components</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 bg-muted/50">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Interactive Demo
            </h3>
            <p className="text-muted-foreground mb-4">
              Click the button to test React state management and Shadcn UI components:
            </p>
            <div className="flex gap-3 items-center">
              <Button onClick={() => setCount(count + 1)}>
                Clicked {count} times
              </Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
              <Button variant="secondary" onClick={() => setCount(count - 1)}>
                Decrement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
