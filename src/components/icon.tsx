import { lineIcons } from "@/lib/site";

/**
 * Stroked 24px line icon. Decorative by default; pass `title` only when the icon
 * is the sole carrier of meaning (it then becomes an image with an accessible name).
 */
export function Icon({
  name,
  className = "size-5",
  strokeWidth = 1.8,
  title,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
  title?: string;
}) {
  const d = lineIcons[name] ?? lineIcons.check;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={d} />
    </svg>
  );
}
