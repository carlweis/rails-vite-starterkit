/**
 * Profile Page Component
 *
 * This component uses shadcn/ui components with semantic theming tokens.
 * All colors are easily customizable via CSS variables in your globals.css:
 *
 * Theming Guide:
 * - Override colors by modifying CSS variables (--primary, --destructive, etc.)
 * - Customize spacing using Tailwind's spacing scale
 * - Extend Alert variants in components/ui/alert.tsx
 * - Override component styles using className prop (all components support cn() utility)
 *
 * Example:
 * <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
 *   Custom card background
 * </Card>
 */

import React, { FormEvent } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

  const passwordForm = useForm({
    user: {
      current_password: '',
      password: '',
      password_confirmation: '',
    }
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    patch('/profile')
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    passwordForm.patch('/profile/password', {
      onSuccess: () => {
        passwordForm.reset()
      }
    })
  }

  function handleDeleteAccount() {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      passwordForm.delete('/profile')
    }
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

          {/* Flash Messages - easily themeable via shadcn variant system */}
          {flash?.notice && (
            <Alert variant="success">
              <AlertDescription>{flash.notice}</AlertDescription>
            </Alert>
          )}
          {flash?.alert && (
            <Alert variant="destructive">
              <AlertDescription>{flash.alert}</AlertDescription>
            </Alert>
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
                    disabled={processing}
                  >
                    {processing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Update Section */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                      id="current_password"
                      name="user[current_password]"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={passwordForm.data.user.current_password}
                      onChange={(e) => passwordForm.setData('user.current_password', e.target.value)}
                      placeholder="••••••••"
                    />
                    {passwordForm.errors['user.current_password'] && (
                      <p className="text-sm text-destructive">{passwordForm.errors['user.current_password']}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      name="user[password]"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={passwordForm.data.user.password}
                      onChange={(e) => passwordForm.setData('user.password', e.target.value)}
                      placeholder="••••••••"
                    />
                    {passwordForm.errors['user.password'] && (
                      <p className="text-sm text-destructive">{passwordForm.errors['user.password']}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Must be at least 6 characters
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                    <Input
                      id="password_confirmation"
                      name="user[password_confirmation]"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={passwordForm.data.user.password_confirmation}
                      onChange={(e) => passwordForm.setData('user.password_confirmation', e.target.value)}
                      placeholder="••••••••"
                    />
                    {passwordForm.errors['user.password_confirmation'] && (
                      <p className="text-sm text-destructive">{passwordForm.errors['user.password_confirmation']}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={passwordForm.processing}
                  >
                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone - Account Deletion */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={passwordForm.processing}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
