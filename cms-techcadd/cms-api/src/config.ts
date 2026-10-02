import 'dotenv/config'
import { z } from 'zod'

/**
 * Environment is validated once, at boot. A missing database password should
 * stop the process immediately with a clear message, not surface as a confusing
 * connection error on the first request.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().min(1),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().min(1),

  COOKIE_SECRET: z.string().min(16, 'COOKIE_SECRET must be at least 16 characters.'),
  /**
   * Cookie flags, settable rather than inferred from NODE_ENV.
   *
   * A staging deployment runs with NODE_ENV=production behind plain HTTP, and
   * a Secure cookie is simply never sent there — which presents as "login does
   * nothing" with no error anywhere. Cross-site embedding needs SameSite=None,
   * which the inferred value cannot express either.
   */
  COOKIE_SECURE: z.string().default('false'),
  COOKIE_SAME_SITE: z.string().default('lax'),
  SESSION_DAYS: z.coerce.number().int().positive().default(7),

  /**
   * A second, shared password in front of the enquiries module — leads carry a
   * name, phone and email, so viewing them takes more than an ordinary CMS
   * session. Independent of user accounts on purpose: rotate it without
   * touching anyone's login.
   *
   * No default in production: 'Techcadd@Leads2027' is sitting in this file in
   * a public git history, so it protects nothing once the app is public. The
   * default below exists only so a fresh clone runs in development without a
   * .env; superRefine below turns its absence into a boot-time error in
   * production instead of a silently public leads list.
   */
  ENQUIRIES_LOCK_PASSWORD: z.string().min(4).optional(),

  /**
   * Sign-in attempts allowed per IP per 15 minutes.
   *
   * Left unset it resolves per environment below: tight in production, where
   * the limit is a defence against credential stuffing, and loose in
   * development, where the only thing it throttles is the people building and
   * testing the CMS.
   */
  LOGIN_ATTEMPTS_PER_15_MIN: z.coerce.number().int().positive().optional(),

  /** Where uploaded files are written. Relative paths resolve from the API's working directory. */
  UPLOAD_DIR: z.string().min(1).default('uploads'),
  /** Largest single upload accepted, in megabytes. */
  MAX_UPLOAD_MB: z.coerce.number().positive().default(10),

  /**
   * SMTP, all optional.
   *
   * Without a host the CMS still runs and mail is logged instead of sent, so a
   * developer never needs a mail server to work on anything else.
   */
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  MAIL_FROM: z.string().default('GIT Education CMS <no-reply@giteducation.org>'),

  /**
   * Where to tell the website that content changed.
   *
   * Both optional: without them the CMS runs exactly as before and the site
   * picks changes up when its own cache expires. Set them and a publish shows
   * on the site straight away instead of waiting out that window.
   */
  SITE_REVALIDATE_URL: z.string().optional(),
  REVALIDATE_SECRET: z.string().optional(),
}).superRefine((value, ctx) => {
  if (value.NODE_ENV === 'production' && !value.ENQUIRIES_LOCK_PASSWORD) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['ENQUIRIES_LOCK_PASSWORD'],
      message:
        'ENQUIRIES_LOCK_PASSWORD must be set in production. The built-in default is public in this ' +
        "repo's git history and protects nothing.",
    })
  }
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration:')
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`)
  }
  console.error('\nCopy .env.example to .env and fill it in.')
  process.exit(1)
}

export const config = {
  ...parsed.data,
  // Development-only convenience; production is guaranteed a real value above.
  ENQUIRIES_LOCK_PASSWORD: parsed.data.ENQUIRIES_LOCK_PASSWORD ?? 'Techcadd@Leads2027',
}
export const isProduction = config.NODE_ENV === 'production'

/** Explicit setting wins; otherwise tight in production, loose in development. */
export const loginAttemptLimit =
  config.LOGIN_ATTEMPTS_PER_15_MIN ?? (isProduction ? 10 : 200)
