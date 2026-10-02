import { Link } from 'react-router-dom'
import { Newspaper } from 'lucide-react'

import { blogHooks } from '../../features/blogs/useBlogs'
import { ContentStatusBadge } from '../common/Badge'
import type { ContentStatus } from '../../types'
import { Button } from '../common/Button'
import { Card, CardBody, CardHeader } from '../common/Card'
import { EmptyState } from '../common/EmptyState'

/**
 * The latest posts, on the dashboard beside Recent Courses.
 *
 * The dashboard counted blogs and showed none of them, so the only way to
 * reach a post just written was the Blogs list — and "did that publish?" is
 * the first question anyone asks after saving one.
 *
 * Newest first by publication date, not by edit date: a post is recent
 * because of when it went out, not when somebody last corrected a typo in it.
 */

/** A dashboard card, not a list screen — enough to see the last few. */
const LIMIT = 5

interface BlogRow {
  id: string
  title: string
  status: ContentStatus
  publishDate?: string
}

const dayMonth = (value?: string) => {
  if (!value) return 'No date'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'No date'
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function RecentBlogs() {
  const { data } = blogHooks.useList({
    page: 1,
    pageSize: LIMIT,
    sort: { field: 'publishDate', dir: 'desc' },
  })

  const posts = (data?.items ?? []) as BlogRow[]

  return (
    <Card flush>
      <CardHeader
        title="Recent Blogs"
        subtitle="Most recently published"
        action={
          <Link to="/blogs">
            <Button variant="secondary" size="sm">
              View all
            </Button>
          </Link>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts yet"
          description="Write your first post and it will show up here."
        />
      ) : (
        <CardBody>
          <ul className="divide-y divide-slate-100">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/blogs/${post.id}`}
                  className="flex items-center gap-3 py-2.5 transition-colors hover:text-primary-700"
                >
                  <span
                    className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900"
                    title={post.title}
                  >
                    {post.title}
                  </span>
                  <span className="shrink-0 text-xs text-slate-500">
                    {dayMonth(post.publishDate)}
                  </span>
                  <ContentStatusBadge status={post.status} />
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>
      )}
    </Card>
  )
}
