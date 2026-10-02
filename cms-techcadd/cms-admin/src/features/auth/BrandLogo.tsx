import { cn } from '../../lib/cn'

interface BrandLogoProps {
  className?: string
  /** Height class, e.g. `h-7`. Sets the size of the wordmark. */
  height?: string
}

/**
 * The name on the signed-out pages.
 *
 * Set as text rather than the website's logo file: that artwork is the parent
 * brand's wordmark, and a sign-in page for this CMS should say whose CMS it is.
 */
export function BrandLogo({ className, height = 'h-6' }: BrandLogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 leading-none font-extrabold tracking-tight text-slate-900',
        height,
        className,
      )}
    >
      <span className="text-primary-600">GIT</span>
      <span className="font-semibold">Education</span>
    </span>
  )
}
