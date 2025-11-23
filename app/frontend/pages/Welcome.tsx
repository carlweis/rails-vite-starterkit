import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

interface WelcomeProps {
  message: string
  user?: {
    name: string
    email: string
  }
}

export default function Welcome({ message, user }: WelcomeProps) {
  return (
    <>
      <Head title="Welcome" />

      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to Rails + Vite + Inertia.js
            </h1>

            <p className="text-xl text-muted-foreground">
              {message}
            </p>
          </div>

          {user && (
            <div className="bg-card border rounded-lg p-6 space-y-2">
              <h2 className="text-2xl font-semibold">Logged in as:</h2>
              <p className="text-lg">
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p className="text-lg">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/home/index">Go to Home Page</Link>
            </Button>

            {!user && (
              <Button variant="outline" asChild>
                <Link href="/users/sign_in">Sign In</Link>
              </Button>
            )}
          </div>

          <div className="bg-muted rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Features Included:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>✅ <span className="font-medium text-foreground">Inertia.js</span> - SPA without building an API</li>
              <li>✅ <span className="font-medium text-foreground">React + TypeScript</span> - Type-safe components</li>
              <li>✅ <span className="font-medium text-foreground">Shadcn UI</span> - Beautiful components</li>
              <li>✅ <span className="font-medium text-foreground">Tailwind CSS</span> - Utility-first styling</li>
              <li>✅ <span className="font-medium text-foreground">Vite</span> - Lightning-fast builds</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
