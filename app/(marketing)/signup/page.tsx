import { Suspense } from 'react'
import { AuthForm } from '@/components/landing/auth-form'

export const metadata = {
  title: 'Create account — buildit',
}

export default function SignupPage() {
  return (
    <main className="relative h-screen bg-bg overflow-hidden">
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  )
}
