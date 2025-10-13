'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

interface EmailFormProps {
  onSendOtp: (email: string) => Promise<{ error?: string; success?: boolean }>
  onSuccess: (email: string) => void
}

export function EmailForm({ onSendOtp, onSuccess }: EmailFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await onSendOtp(email)
      
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess(email)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={loading || !email}
        className="w-full"
      >
        {loading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Sending OTP...
          </>
        ) : (
          'Send OTP'
        )}
      </Button>
    </form>
  )
}