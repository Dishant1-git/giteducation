import { lazy, Suspense } from 'react'
import { Lock } from 'lucide-react'

import { Button } from '../../components/common/Button'
import { SkeletonTable } from '../../components/feedback/Skeleton'
import { Spinner } from '../../components/feedback/Spinner'
import { EnquiriesLockScreen } from './EnquiriesLockScreen'
import { useEnquiriesLock } from './useEnquiriesLock'

const EnquiriesListPage = lazy(() => import('./EnquiriesListPage'))

/**
 * Sits in front of the real list page. The route itself is reachable by any
 * signed-in CMS user — this is what actually keeps lead data hidden until the
 * shared password is entered, on this browser, on top of that session.
 */
export default function EnquiriesGate() {
  const { checking, unlocked, unlock, lock, locking } = useEnquiriesLock()

  if (checking) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <Spinner size={22} />
      </div>
    )
  }

  if (!unlocked) {
    return <EnquiriesLockScreen onUnlock={unlock} />
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          icon={Lock}
          disabled={locking}
          onClick={() => lock()}
        >
          Lock enquiries
        </Button>
      </div>

      <Suspense fallback={<SkeletonTable />}>
        <EnquiriesListPage />
      </Suspense>
    </div>
  )
}
