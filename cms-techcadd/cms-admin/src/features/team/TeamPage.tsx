import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BarChart3, Plus, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ApiError, usersApi } from '../../api'
import { Button } from '../../components/common/Button'
import { Card, CardBody } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { Modal } from '../../components/common/Modal'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Switch } from '../../components/form/Switch'
import { SkeletonTable } from '../../components/feedback/Skeleton'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import type { User } from '../../types'

const ROLES = [
  { value: 'editor', label: 'Editor — content only' },
  { value: 'admin', label: 'Admin — content, settings, accounts and enquiries' },
]

const BLANK = { name: '', email: '', role: 'editor' as User['role'], active: true }

/**
 * The people who can sign in, and what each may do.
 *
 * This is where a contribution report gets its subjects: everything on Team
 * Contributions is counted per account, so until somebody has one there is
 * exactly one person to report on.
 *
 * A created account is given a one-time password by the API rather than one
 * chosen here — it is shown once, on the screen, and never stored anywhere
 * this page can read again. Emailing it would put a working credential in a
 * mailbox; typing one in for somebody else means knowing their password.
 */
export default function TeamPage() {
  const client = useQueryClient()
  const toast = useToast()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [draft, setDraft] = useState({ ...BLANK })
  const [issued, setIssued] = useState<{ username: string; password: string } | null>(null)
  const [removing, setRemoving] = useState<User | null>(null)

  const team = useQuery({
    queryKey: ['users', 'team'],
    queryFn: () => usersApi.list({ page: 1, pageSize: 100 }),
  })

  const members = team.data?.items ?? []

  function refresh() {
    void client.invalidateQueries({ queryKey: ['users'] })
  }

  const save = useMutation({
    mutationFn: async () => {
      if (editing) return usersApi.update(editing.id, draft)
      return usersApi.create(draft)
    },
    onSuccess: (result: unknown) => {
      const created = result as { temporaryPassword?: string; username?: string }
      if (!editing && created?.temporaryPassword) {
        // Both halves, shown once. The password alone is not enough to sign in
        // and the username is not the email — leaving it out sent somebody to
        // a login screen with half a credential.
        setIssued({
          username: created.username ?? '',
          password: created.temporaryPassword,
        })
      } else {
        toast.success('Account updated.')
      }
      setOpen(false)
      refresh()
    },
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : 'Could not save that account.'),
  })

  const remove = useMutation({
    mutationFn: () => usersApi.remove([removing!.id]),
    onSuccess: () => {
      toast.success('Account removed.')
      setRemoving(null)
      refresh()
    },
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : 'Could not remove that account.'),
  })

  function startNew() {
    setEditing(null)
    setDraft({ ...BLANK })
    setOpen(true)
  }

  function startEdit(member: User) {
    setEditing(member)
    setDraft({
      name: member.name,
      email: member.email,
      role: member.role,
      active: member.active,
    })
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Everyone who can sign in to this CMS. Contribution reports are counted per account, so this is where they come from."
        actions={
          <Button icon={Plus} onClick={startNew}>
            Add person
          </Button>
        }
      />

      <Card flush>
        <CardBody className="p-0">
          {team.isLoading ? (
            <div className="p-4">
              <SkeletonTable />
            </div>
          ) : members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No accounts yet"
              description="Add someone and they can sign in and start contributing."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {members.map((member) => (
                <li key={member.id} className="flex flex-wrap items-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => startEdit(member)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="text-sm font-medium text-slate-800">{member.name}</span>
                    <span className="ml-2 text-xs text-slate-400">{member.email}</span>
                    {member.username && (
                      <p className="text-xs text-slate-500">
                        signs in as <span className="font-mono">{member.username}</span>
                      </p>
                    )}
                  </button>

                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                      member.role === 'admin'
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {member.role === 'admin' ? 'Admin' : 'Editor'}
                  </span>

                  {!member.active && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                      Deactivated
                    </span>
                  )}

                  <Link
                    to={`/team-contributions/${member.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    <BarChart3 size={14} aria-hidden="true" />
                    Contributions
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    aria-label={`Remove ${member.name}`}
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => setRemoving(member)}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={editing ? 'Edit account' : 'Add someone to the team'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => save.mutate()}
              disabled={save.isPending || !draft.name.trim() || !draft.email.trim()}
            >
              {editing ? 'Save' : 'Create account'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Name" required description="Shown on contribution reports.">
            <Input
              value={draft.name}
              onChange={(event) => setDraft((c) => ({ ...c, name: event.target.value }))}
              placeholder="Sandeep Kaur"
            />
          </FormField>

          <FormField
            label="Email"
            required
            description="Their sign-in username is taken from the part before the @ — kaursandeep.tce@gmail.com signs in as kaursandeep.tce."
          >
            <Input
              type="email"
              value={draft.email}
              onChange={(event) => setDraft((c) => ({ ...c, email: event.target.value }))}
              placeholder="name@giteducation.org"
            />
          </FormField>

          <FormField label="Role" description="An editor cannot change settings or accounts.">
            <Select
              value={draft.role}
              onChange={(event) => setDraft((c) => ({ ...c, role: event.target.value as User['role'] }))}
              options={ROLES}
            />
          </FormField>

          <Switch
            checked={draft.active}
            onCheckedChange={(active) => setDraft((c) => ({ ...c, active }))}
            label="Can sign in"
            description="Turning this off ends their sessions immediately and keeps everything they wrote."
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(issued)}
        onOpenChange={(next) => { if (!next) setIssued(null) }}
        title="Account created"
        footer={
          <Button onClick={() => setIssued(null)}>Done</Button>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Send them both of these. The password is shown once and cannot be read again — if
            it is lost, use “Forgot password” on the sign-in screen.
          </p>

          <dl className="divide-y divide-slate-200 rounded-lg border border-slate-200">
            <div className="flex items-baseline gap-3 px-4 py-3">
              <dt className="w-24 shrink-0 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Username
              </dt>
              <dd className="font-mono text-sm break-all text-slate-800">{issued?.username}</dd>
            </div>
            <div className="flex items-baseline gap-3 px-4 py-3">
              <dt className="w-24 shrink-0 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Password
              </dt>
              <dd className="font-mono text-sm break-all text-slate-800">{issued?.password}</dd>
            </div>
          </dl>

          <p className="text-xs text-slate-500">
            They sign in with the username, not the email address. It can be changed under
            Settings → Security once they are in.
          </p>
        </div>
      </Modal>

      <Modal
        open={Boolean(removing)}
        onOpenChange={(next) => { if (!next) setRemoving(null) }}
        title={`Remove ${removing?.name ?? 'this account'}?`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemoving(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => remove.mutate()} disabled={remove.isPending}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          They will not be able to sign in. Everything they wrote stays, and their past
          contributions stay on the reports — the history records what happened, not who still
          has an account.
        </p>
      </Modal>
    </div>
  )
}
