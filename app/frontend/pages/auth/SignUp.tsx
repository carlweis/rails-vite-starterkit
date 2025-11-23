import React, { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface SignUpProps {
  flash?: {
    alert?: string
    notice?: string
  }
}

export default function SignUp({ flash }: SignUpProps) {
  const { data, setData, post, processing, errors } = useForm({
    user: {
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
    }
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/users')
  }

  return (
    <>
      <Head title="Sign Up" />

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 py-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block text-4xl font-bold tracking-tight mb-2">
              RAILS
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Join us and start building
            </p>
          </div>

          {/* Alerts */}
          {flash?.alert && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md border border-destructive/20">
              {flash.alert}
            </div>
          )}
          {flash?.notice && (
            <div className="bg-primary/10 text-primary text-sm px-4 py-3 rounded-md border border-primary/20">
              {flash.notice}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="user[name]"
                  type="text"
                  autoComplete="name"
                  value={data.user.name}
                  onChange={(e) => setData('user.name', e.target.value)}
                  className="h-12"
                  placeholder="John Doe"
                />
                {errors['user.name'] && (
                  <p className="text-sm text-destructive">{errors['user.name']}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="user[username]"
                  type="text"
                  autoComplete="username"
                  value={data.user.username}
                  onChange={(e) => setData('user.username', e.target.value)}
                  className="h-12"
                  placeholder="johndoe"
                />
                {errors['user.username'] && (
                  <p className="text-sm text-destructive">{errors['user.username']}</p>
                )}
              </div>

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
                  className="h-12"
                  placeholder="you@example.com"
                />
                {errors['user.email'] && (
                  <p className="text-sm text-destructive">{errors['user.email']}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="user[password]"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={data.user.password}
                  onChange={(e) => setData('user.password', e.target.value)}
                  className="h-12"
                  placeholder="••••••••"
                />
                {errors['user.password'] && (
                  <p className="text-sm text-destructive">{errors['user.password']}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  name="user[password_confirmation]"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={data.user.password_confirmation}
                  onChange={(e) => setData('user.password_confirmation', e.target.value)}
                  className="h-12"
                  placeholder="••••••••"
                />
                {errors['user.password_confirmation'] && (
                  <p className="text-sm text-destructive">{errors['user.password_confirmation']}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={processing}
            >
              {processing ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/users/sign_in"
                className="font-medium text-foreground hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
