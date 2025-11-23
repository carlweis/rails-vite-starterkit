import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/Layout'

interface WelcomeProps {
  message: string
  user?: {
    id: number
    name: string
    email: string
    username?: string
    role?: 'user' | 'admin'
  }
}

export default function Welcome({ message, user }: WelcomeProps) {
  return (
    <Layout user={user}>
      <Head title="Welcome" />

      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tight uppercase">
              Make Something People Want.
            </h1>

            <p className="text-xl text-muted-foreground">
              Your next great idea starts here.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
