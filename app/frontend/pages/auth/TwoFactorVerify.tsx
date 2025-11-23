import React, { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield } from 'lucide-react'

interface TwoFactorVerifyProps {
  flash?: {
    alert?: string
    notice?: string
  }
  error?: string
}

export default function TwoFactorVerify({ flash, error }: TwoFactorVerifyProps) {
  const { data, setData, post, processing, errors } = useForm({
    otp_attempt: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/users/two_factor_authentication')
  }

  return (
    <>
      <Head title="Two-Factor Verification" />

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <Link href="/" className="inline-block text-4xl font-bold tracking-tight mb-2">
              RAILS
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Two-factor authentication
            </h1>
            <p className="text-muted-foreground">
              Enter the code from your authenticator app
            </p>
          </div>

          {/* Alerts */}
          {(flash?.alert || error) && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md border border-destructive/20">
              {flash?.alert || error}
            </div>
          )}
          {flash?.notice && (
            <div className="bg-primary/10 text-primary text-sm px-4 py-3 rounded-md border border-primary/20">
              {flash.notice}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp_attempt">Authentication Code</Label>
              <Input
                id="otp_attempt"
                name="otp_attempt"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                value={data.otp_attempt}
                onChange={(e) => setData('otp_attempt', e.target.value)}
                className="h-12 text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
              />
              {errors.otp_attempt && (
                <p className="text-sm text-destructive">{errors.otp_attempt}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={processing}
            >
              {processing ? 'Verifying...' : 'Verify'}
            </Button>
          </form>

          {/* Back link */}
          <div className="text-center">
            <Link
              href="/users/sign_in"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
