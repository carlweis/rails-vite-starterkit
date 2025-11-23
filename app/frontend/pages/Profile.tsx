import React, { FormEvent } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
  id: number
  name?: string
  username?: string
  email: string
  role: 'user' | 'admin'
}

interface ProfileProps {
  user: User
}

export default function Profile({ user }: ProfileProps) {
  const { flash } = usePage().props as any

  const { data, setData, patch, processing, errors } = useForm({
    user: {
      name: user.name || '',
      username: user.username || '',
      email: user.email,
    }
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    patch('/profile')
  }

  return (
    <Layout user={user}>
      <Head title="Profile" />

      <div className="container max-w-4xl py-8 px-4 md:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information
            </p>
          </div>

          {/* Flash Messages */}
          {flash?.notice && (
            <div className="bg-primary/10 text-primary text-sm px-4 py-3 rounded-md border border-primary/20">
              {flash.notice}
            </div>
          )}
          {flash?.alert && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md border border-destructive/20">
              {flash.alert}
            </div>
          )}

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="user[name]"
                      type="text"
                      autoComplete="name"
                      value={data.user.name}
                      onChange={(e) => setData('user.name', e.target.value)}
                      className="h-11"
                      placeholder="John Doe"
                    />
                    {errors['user.name'] && (
                      <p className="text-sm text-destructive">{errors['user.name']}</p>
                    )}
                  </div>

                  {/* Username Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="user[username]"
                      type="text"
                      autoComplete="username"
                      value={data.user.username}
                      onChange={(e) => setData('user.username', e.target.value)}
                      className="h-11"
                      placeholder="johndoe"
                    />
                    {errors['user.username'] && (
                      <p className="text-sm text-destructive">{errors['user.username']}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="user[email]"
                      type="email"
                      autoComplete="email"
                      required
                      value={data.user.email}
                      onChange={(e) => setData('user.email', e.target.value)}
                      className="h-11"
                      placeholder="you@example.com"
                    />
                    {errors['user.email'] && (
                      <p className="text-sm text-destructive">{errors['user.email']}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-11 px-8"
                    disabled={processing}
                  >
                    {processing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
