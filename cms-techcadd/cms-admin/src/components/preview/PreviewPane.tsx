import { useCallback, useState } from 'react'
import { ExternalLink, Eye, Monitor, RefreshCw, Smartphone, Tablet } from 'lucide-react'

import { cn } from '../../lib/cn'
import { DEVICES, type DeviceId, type PreviewKind } from './previewProtocol'

const ICONS = { Monitor, Tablet, Smartphone }

/**
 * The published page, framed beside the form that edits it.
 *
 * This shows what is saved, not what is being typed. The website renders its
 * pages on the server from the CMS's published records and has no draft
 * route to post unsaved work into, so the honest preview is the live page:
 * save, press reload here, and the frame shows what a visitor now gets.
 *
 * `kind` and `draft` are still accepted so the forms that feed this do not
 * change shape; a draft channel can be added behind them without touching a
 * caller.
 */
export function PreviewPane<T>({
  liveUrl,
  unavailable,
  className,
}: {
  kind: PreviewKind
  draft: T
  /** Unused here — kept so callers do not change. See the note above. */
  focus?: string
  /** The public URL of the saved, published page. */
  liveUrl?: string
  /** Why there is nothing to show, when the reason is not "unpublished". */
  unavailable?: string
  className?: string
}) {
  const [device, setDevice] = useState<DeviceId>('desktop')
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  const width = DEVICES.find((d) => d.id === device)?.width ?? null

  return (
    <div className={cn('flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs font-medium text-slate-500">Published page</span>
          {DEVICES.map((option) => {
            const Icon = ICONS[option.icon]
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setDevice(option.id)}
                aria-pressed={device === option.id}
                title={option.label}
                className={cn(
                  'grid size-7 place-items-center rounded-md transition-colors',
                  device === option.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
                )}
              >
                <Icon size={15} aria-hidden="true" />
                <span className="sr-only">{option.label}</span>
              </button>
            )
          })}
        </div>

        {liveUrl && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={reload}
              title="Reload"
              className="grid size-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <RefreshCw size={14} aria-hidden="true" />
              <span className="sr-only">Reload</span>
            </button>

            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open the published page in a new tab"
              className="grid size-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span className="sr-only">Open the published page in a new tab</span>
            </a>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-slate-200/60 p-3">
        {liveUrl ? (
          <div
            className="mx-auto h-full bg-white shadow-sm transition-[width] duration-300"
            style={{ width: width ? `${width}px` : '100%', maxWidth: '100%' }}
          >
            <iframe key={nonce} src={liveUrl} title="Published page" className="h-full w-full border-0" />
          </div>
        ) : (
          <div className="grid h-full place-items-center p-6 text-center">
            <div className="max-w-xs">
              <Eye size={22} className="mx-auto text-slate-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-700">Nothing published to show yet</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {unavailable ?? 'Publish and save, and the page as visitors see it appears here.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {liveUrl && (
        <p className="border-t border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
          Shows the saved, published page — not what is being typed. Save, then reload here.
        </p>
      )}
    </div>
  )
}
