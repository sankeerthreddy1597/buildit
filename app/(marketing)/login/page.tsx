import { Suspense } from 'react'
import { AuthForm } from '@/components/landing/auth-form'

export const metadata = {
  title: 'Sign in — buildit',
}

export default function LoginPage() {
  return (
    <main className="relative h-screen bg-bg overflow-hidden">
      <Suspense>
        <AuthForm mode="signin" />
      </Suspense>
    </main>
  )
}
