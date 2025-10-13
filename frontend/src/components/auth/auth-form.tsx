'use client'

import React, { useState } from 'react'
import { EmailForm } from './email-form'
import { OtpForm } from './otp-form'
import { useAuthStore } from '@/providers/auth-provider'

type AuthStep = 'email' | 'otp'

export function AuthForm() {
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const { sendOtp, verifyOtp } = useAuthStore((state) => state)

  const handleSendOtp = async (email: string) => {
    const result = await sendOtp(email)
    return result
  }

  const handleVerifyOtp = async (email: string, otp: string) => {
    const result = await verifyOtp(email, otp)
    return result
  }

  const handleEmailSuccess = (email: string) => {
    setEmail(email)
    setStep('otp')
  }

  const handleBackToEmail = () => {
    setStep('email')
    setEmail('')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg border">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-gray-600 mt-2">
            {step === 'email' 
              ? 'Enter your email to get started' 
              : 'Check your email for the verification code'
            }
          </p>
        </div>

        {step === 'email' ? (
          <EmailForm
            onSendOtp={handleSendOtp}
            onSuccess={handleEmailSuccess}
          />
        ) : (
          <OtpForm
            email={email}
            onVerifyOtp={handleVerifyOtp}
            onResendOtp={handleSendOtp}
            onBack={handleBackToEmail}
          />
        )}
      </div>
    </div>
  )
}