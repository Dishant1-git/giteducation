import { createHash, timingSafeEqual } from 'node:crypto'
import type { CookieOptions, NextFunction, Request, Response } from 'express'

import { config } from '../../config.js'
import { forbidden } from '../../http/errors.js'

export const ENQUIRIES_LOCK_COOKIE = 'giteducation_enquiries_unlock'

/**
 * Deliberately short-lived compared to the session cookie: this gate exists
 * so a browser left open at a desk does not leave leads exposed all day.
 */
const LOCK_HOURS = 12

export const lockCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.COOKIE_SECURE === 'true',
  sameSite: (config.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none',
  signed: true,
  maxAge: LOCK_HOURS * 60 * 60 * 1000,
  path: '/',
}

/**
 * Hashing both sides first means `timingSafeEqual` never sees mismatched
 * lengths, so a short guess cannot be told apart from a near-miss by timing.
 */
export function checkEnquiriesPassword(candidate: string): boolean {
  const a = createHash('sha256').update(candidate).digest()
  const b = createHash('sha256').update(config.ENQUIRIES_LOCK_PASSWORD).digest()
  return timingSafeEqual(a, b)
}

/**
 * A second gate in front of lead data, on top of the ordinary session.
 *
 * Every signed-in CMS user can reach `/enquiries` in the router; this is what
 * actually stops them reading it without also knowing the shared password.
 */
export function requireEnquiriesUnlock(req: Request, _res: Response, next: NextFunction): void {
  if (req.signedCookies?.[ENQUIRIES_LOCK_COOKIE] === '1') return next()
  next(forbidden('Enter the enquiries password to continue.'))
}
