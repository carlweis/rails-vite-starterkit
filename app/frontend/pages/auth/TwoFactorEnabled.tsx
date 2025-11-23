import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/Layout'
import { Shield, CheckCircle2 } from 'lucide-react'

interface TwoFactorEnabledProps {
  user: {
    otp_enabled: boolean
  }
  flash?: {
    alert?: string
    notice?: string
  }
}

export default function TwoFactorEnabled({ user, flash }: TwoFactorEnabledProps) {
  const { delete: deleteMethod, processing } = useForm()

  function handleDisable() {
    if (confirm('Are you sure you want to disable two-factor authentication?')) {
      deleteMethod('/users/two_factor_settings')
    }
  }

  return (
    <Layout>
      <Head title="Two-Factor Authentication" />

      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 py-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Two-factor authentication is enabled
            </h1>
            <p className="text-muted-foreground">
              Your account is protected with an extra layer of security
            </p>
          </div>

          {/* Alerts */}
          {flash?.alert && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md border border-destructive/20">
              {flash.alert}
            </div>
          )}
          {flash?.notice && (
            <div className="bg-green-500/10 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-md border border-green-500/20">
              {flash.notice}
            </div>
          )}

          {/* Info Card */}
          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Protection active</h2>
                <p className="text-sm text-muted-foreground">
                  Every time you sign in, you'll need to enter a verification code from your authenticator app.
                  This helps keep your account secure even if someone knows your password.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <h3 className="text-sm font-semibold">Manage two-factor authentication</h3>
              <Button
                variant="destructive"
                onClick={handleDisable}
                disabled={processing}
              >
                {processing ? 'Disabling...' : 'Disable Two-Factor Authentication'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Warning: Disabling 2FA will make your account less secure.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
