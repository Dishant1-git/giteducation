import { cn } from '../../lib/cn'

/**
 * GIT Education wordmark, set as live text so it stays crisp at any size and
 * inherits its colour from `currentColor` — the sidebar is dark, so the
 * supplied artwork (see BrandLogo) cannot be used there.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 40"
      role="img"
      aria-label="GIT Education"
      className={cn('h-auto', className)}
      fill="currentColor"
    >
      <text x="0" y="29" fontSize="26" fontWeight="800" letterSpacing="-0.5" fontFamily="inherit">
        GIT
      </text>
      <text x="52" y="29" fontSize="17" fontWeight="500" fontFamily="inherit" opacity="0.85">
        Education
      </text>
    </svg>
  )
}

/**
 * Square app mark — used in the collapsed sidebar and as the favicon.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="GIT Education"
      className={cn('shrink-0', className)}
    >
      <rect width="40" height="40" rx="11" fill="currentColor" />
      <text
        x="20"
        y="27.5"
        textAnchor="middle"
        fontSize="21"
        fontWeight="800"
        fontFamily="inherit"
        fill="#fff"
      >
        G
      </text>
    </svg>
  )
}
