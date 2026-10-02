import 'dotenv/config'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import { createApp } from '../src/app.js'
import { pool } from '../src/db/pool.js'

/**
 * These tests truncate tables. Refuse to touch a database that is not obviously
 * a test one.
 *
 * Not a hypothetical: run against the development database, this suite deletes
 * whatever content is being worked on — twice it has removed published records
 * mid-task. `npm test` sets DB_NAME itself; this is the guard for every other
 * way the suite might be started.
 */
const databaseName = process.env.DB_NAME ?? ''
if (!/_test$/.test(databaseName)) {
  throw new Error(
    `Refusing to run: DB_NAME is "${databaseName}", which does not end in "_test".\n` +
      'These tests empty tables. Run them with `npm test`, which points them at a\n' +
      'throwaway database, or set DB_NAME yourself to one ending in _test.',
  )
}

/**
 * The tests drive a real server against the real database.
 *
 * Not mocks: every bug this suite was written from — an id too long for its
 * column, a relation that could not be cleared, a NOT NULL column handed an
 * empty string — was invisible to anything that stubbed MySQL out.
 */
let server: Server | undefined
let baseUrl = ''

export async function startServer(): Promise<string> {
  if (server) return baseUrl

  // Port 0 lets the OS pick a free one, so a running dev server on 4000 does
  // not collide with the suite.
  server = createApp().listen(0)
  await new Promise<void>((resolve) => server?.once('listening', resolve))

  const { port } = server.address() as AddressInfo
  baseUrl = `http://127.0.0.1:${port}/api`
  return baseUrl
}

export async function stopServer(): Promise<void> {
  if (server) {
    await new Promise<void>((resolve) => server?.close(() => resolve()))
    server = undefined
  }
  await pool.end()
}

export interface ApiResponse<T = any> {
  status: number
  body: T
}

/** A client that carries its own cookies, so several users can act at once. */
export function client() {
  /**
   * Kept by name rather than as one string.
   *
   * More than one endpoint sets a cookie now — the session at sign-in, the
   * enquiries gate at unlock — and a response carries only the cookie it is
   * changing. Overwriting the jar with the latest Set-Cookie therefore threw
   * the session away the moment anything else set one, which surfaced as
   * "You are not signed in" on the request after unlocking.
   */
  const jar = new Map<string, string>()

  async function call<T = any>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const isForm = body instanceof FormData
    const res = await fetch(baseUrl + path, {
      method,
      headers: {
        ...(isForm || body === undefined ? {} : { 'content-type': 'application/json' }),
        ...(jar.size
          ? {
              cookie: [...jar]
                .map(([name, value]) => `${name}=${value}`)
                .join('; '),
            }
          : {}),
      },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    })

    for (const raw of res.headers.getSetCookie?.() ?? []) {
      const [pair, ...attributes] = raw.split(';')
      const eq = pair.indexOf('=')
      if (eq < 1) continue
      const name = pair.slice(0, eq).trim()
      const value = pair.slice(eq + 1).trim()

      // A cleared cookie is sent as an expiry, not as an absence — honour it,
      // so signing out or re-locking actually drops it from the jar.
      const cleared =
        value === '' ||
        attributes.some((a) => /^\s*max-age\s*=\s*0\s*$/i.test(a))
      if (cleared) jar.delete(name)
      else jar.set(name, value)
    }

    const text = await res.text()
    return { status: res.status, body: text ? JSON.parse(text) : undefined }
  }

  return {
    call,
    get: <T = any>(path: string) => call<T>('GET', path),
    post: <T = any>(path: string, body?: unknown) => call<T>('POST', path, body),
    patch: <T = any>(path: string, body?: unknown) => call<T>('PATCH', path, body),
    delete: <T = any>(path: string, body?: unknown) => call<T>('DELETE', path, body),
    async signIn(identifier = ADMIN_USERNAME, password = ADMIN_PASSWORD) {
      const res = await call('POST', '/auth/login', { identifier, password })
      if (res.status !== 200) {
        throw new Error(`sign-in failed (${res.status}): ${JSON.stringify(res.body)}`)
      }
      return res.body
    },
    /**
     * Clears the shared password in front of enquiries.
     *
     * A signed-in admin still cannot read a lead until this passes, so any
     * test that touches enquiries — directly, or through the dashboard and
     * search, which count them — has to do what a person would.
     */
    async unlockEnquiries(password = ENQUIRIES_PASSWORD) {
      const res = await call('POST', '/enquiries/unlock', { password })
      if (res.status !== 204) {
        throw new Error(`enquiries unlock failed (${res.status}): ${JSON.stringify(res.body)}`)
      }
    },
  }
}

export type Client = ReturnType<typeof client>

export const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? 'admin@techcadd.com'
/** What sign-in actually matches on — the email is only the account's address. */
export const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME ?? 'techcadd'
export const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? 'ChangeMe123'
/** Matches the default in config.ts; the API is started without an override. */
export const ENQUIRIES_PASSWORD =
  process.env.ENQUIRIES_LOCK_PASSWORD ?? 'Techcadd@Leads2027'

/** Empties the tables a test touches, children first. */
export async function resetTables(...tables: string[]): Promise<void> {
  for (const table of tables) {
    await pool.query(`DELETE FROM \`${table}\``)
  }
}

/**
 * Leaves exactly the seeded administrator, active and named as it started.
 *
 * The tests rename and deactivate accounts, so an aborted run would otherwise
 * leave the next one asserting against the wrong starting state.
 */
export async function resetUsers(): Promise<void> {
  await pool.query('DELETE FROM users WHERE email <> ?', [ADMIN_EMAIL])
  await pool.query("UPDATE users SET name = 'techcadd-team', active = 1 WHERE email = ?", [
    ADMIN_EMAIL,
  ])
}

export { pool }
