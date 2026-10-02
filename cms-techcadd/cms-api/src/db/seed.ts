import { randomBytes, randomUUID } from 'node:crypto'

import { execute, pool, queryOne } from './pool.js'
import { hashPassword } from '../modules/auth/auth.service.js'

/**
 * Creates the first administrator so the CMS is reachable. Idempotent — running
 * it twice leaves the existing account alone rather than resetting a password
 * someone has already changed.
 */
const isProduction = process.env.NODE_ENV === 'production'
const EMAIL = process.env.SEED_EMAIL ?? 'admin@giteducation.org'
/*
 * 'GitEducation@2026' is a fine convenience in development, where nobody but the
 * developer running this ever sees it. In production it is not a secret at
 * all — it's sitting in this file in a public git history — so a deployment
 * that forgets to set SEED_PASSWORD does not get a weak default, it gets a
 * password every reader of this repo already has. Generated instead, and
 * printed once: the same "change it after first sign-in" contract, but the
 * thing being printed is actually only known to whoever reads this log.
 */
const PASSWORD =
  process.env.SEED_PASSWORD ?? (isProduction ? randomBytes(12).toString('base64url') : 'GitEducation@2026')
const NAME = process.env.SEED_NAME ?? 'GIT Education Team'
/** What is actually typed into the login form — see 018_user_username.sql. */
const USERNAME = process.env.SEED_USERNAME ?? 'giteducation'

async function seed(): Promise<void> {
  // Either identifier colliding means an account is already here. Checked
  // together because both columns are unique: inserting on a match of one
  // would fail on the other anyway, with a raw SQL error instead of this note.
  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
    [EMAIL, USERNAME],
  )

  if (existing) {
    console.log('An account with that email or username already exists — nothing to do.')
    return
  }

  await execute(
    `INSERT INTO users (id, name, email, username, password_hash, role, active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'admin', 1, NOW(3), NOW(3))`,
    [randomUUID(), NAME, EMAIL, USERNAME, await hashPassword(PASSWORD)],
  )

  console.log(`Created administrator: ${NAME} <${EMAIL}>`)
  console.log(`Username: ${USERNAME}`)
  console.log(`Password: ${PASSWORD}`)
  console.log('\nChange it after the first sign-in (Settings → Security).')
}

seed()
  .catch((error: unknown) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
