'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

interface OtpFormProps {
  email: string
  onVerifyOtp: (email: string, otp: string) => Promise<{ error?: string; success?: boolean }>
  onResendOtp: (email: string) => Promise<{ error?: string; success?: boolean }>
  onBack: () => void
}

export function OtpForm({ email, onVerifyOtp, onResendOtp, onBack }: OtpFormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('')
    
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await onVerifyOtp(email, code)
      
      if (result.error) {
        setError(result.error)
        // Clear OTP fields on error
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('An unexpected error occurred')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    
    try {
      const result = await onResendOtp(email)
      
      if (result.error) {
        setError(result.error)
      } else {
        setCountdown(60)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Verify your email</h2>
        <p className="text-sm text-gray-600 mt-2">
          We&apos;ve sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <Label>Enter verification code</Label>
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold"
              disabled={loading}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={() => handleVerify()}
          disabled={loading || otp.some(digit => !digit)}
          className="w-full"
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>

        <div className="text-center text-sm">
          {countdown > 0 ? (
            <span className="text-gray-600">
              Resend code in {countdown}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full"
          disabled={loading}
        >
          Back to email
        </Button>
      </div>
    </div>
  )
}