import React, { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Layout } from '@/components/Layout'
import { Shield, Smartphone } from 'lucide-react'

interface TwoFactorSetupProps {
  qr_code: string
  secret: string
  flash?: {
    alert?: string
    notice?: string
  }
  error?: string
}

export default function TwoFactorSetup({ qr_code, secret, flash, error }: TwoFactorSetupProps) {
  const { data, setData, post, processing, errors } = useForm({
    otp_attempt: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/users/two_factor_settings')
  }

  return (
    <Layout>
      <Head title="Two-Factor Authentication Setup" />

      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 py-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Set up two-factor authentication
            </h1>
            <p className="text-muted-foreground">
              Add an extra layer of security to your account
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

          {/* Setup Instructions */}
          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Step 1: Install an authenticator app
              </h2>
              <p className="text-sm text-muted-foreground">
                Download an authenticator app like Google Authenticator, Authy, or 1Password on your mobile device.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Step 2: Scan the QR code</h2>
              <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border">
                <div dangerouslySetInnerHTML={{ __html: qr_code }} />
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Can't scan? Enter this code manually:
                  </p>
                  <code className="block px-4 py-2 bg-muted rounded text-sm font-mono">
                    {secret}
                  </code>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Step 3: Verify your code</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp_attempt">Enter 6-digit code</Label>
                  <Input
                    id="otp_attempt"
                    name="otp_attempt"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={data.otp_attempt}
                    onChange={(e) => setData('otp_attempt', e.target.value)}
                    className="h-12 text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                  />
                  {errors.otp_attempt && (
                    <p className="text-sm text-destructive">{errors.otp_attempt}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base font-medium"
                    disabled={processing}
                  >
                    {processing ? 'Verifying...' : 'Enable 2FA'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12"
                    asChild
                  >
                    <Link href="/">Cancel</Link>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
