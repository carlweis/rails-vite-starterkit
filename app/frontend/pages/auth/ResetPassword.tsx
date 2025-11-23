import React, { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ResetPasswordProps {
  reset_password_token: string
  flash?: {
    alert?: string
    notice?: string
  }
}

export default function ResetPassword({ reset_password_token, flash }: ResetPasswordProps) {
  const { data, setData, put, processing, errors } = useForm({
    reset_password_token: reset_password_token,
    password: '',
    password_confirmation: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    put('/users/password')
  }

  return (
    <>
      <Head title="Reset Password" />

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block text-4xl font-bold tracking-tight mb-2">
              RAILS
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Set new password
            </h1>
            <p className="text-muted-foreground">
              Choose a strong password for your account
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
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="h-12"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="h-12"
                  placeholder="••••••••"
                />
                {errors.password_confirmation && (
                  <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={processing}
            >
              {processing ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
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
