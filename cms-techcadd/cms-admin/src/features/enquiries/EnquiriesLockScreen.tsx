import { useState, type FormEvent } from 'react'
import { KeyRound, ShieldCheck } from 'lucide-react'

import { ApiError } from '../../api'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'

interface EnquiriesLockScreenProps {
  onUnlock: (password: string) => Promise<void>
}

/** Gate shown in place of the enquiries list until the shared password is entered. */
export function EnquiriesLockScreen({ onUnlock }: EnquiriesLockScreenProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(undefined)

    if (!password) {
      setError('Enter the enquiries password.')
      return
    }

    setPending(true)
    try {
      await onUnlock(password)
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Could not unlock. Please try again.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm p-7 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <KeyRound size={22} aria-hidden="true" />
        </span>

        <h1 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
          Enquiries are locked
        </h1>
        <p className="mt-1.5 text-[13px] text-slate-500">
          This page lists student names, phone numbers and emails. Enter the enquiries
          password to continue.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4 text-left">
          {error && <Alert tone="error">{error}</Alert>}

          <FormField label="Enquiries password" hideLabel>
            <Input
              icon={KeyRound}
              type="password"
              autoComplete="off"
              autoFocus
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (error) setError(undefined)
              }}
              placeholder="Enter the enquiries password"
            />
          </FormField>

          <Button type="submit" fullWidth disabled={pending}>
            {pending && <Spinner />}
            {pending ? 'Checking…' : 'Unlock'}
          </Button>
        </form>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" aria-hidden="true" />
          Stays unlocked on this browser for 12 hours
        </p>
      </Card>
    </div>
  )
}
