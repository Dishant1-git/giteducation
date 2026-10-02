import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { categoriesApi, coursesApi, faqsApi, reviewsApi, type ListParams } from '../../api'
import type { CourseCreate, CourseUpdate } from '../../api/resources/courses'

const COURSES_KEY = 'courses'

export function useCoursesList(params: ListParams) {
  return useQuery({
    queryKey: [COURSES_KEY, 'list', params],
    queryFn: () => coursesApi.list(params),
  })
}

export function useCourse(id?: string) {
  return useQuery({
    queryKey: [COURSES_KEY, 'detail', id],
    queryFn: () => coursesApi.get(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateCourse() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (input: CourseCreate) => coursesApi.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: [COURSES_KEY] }),
  })
}

export function useUpdateCourse() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CourseUpdate }) =>
      coursesApi.update(id, input),
    onSuccess: (course) => {
      // Write the fresh record through so the edit form does not flash stale
      // values while the list refetches.
      client.setQueryData([COURSES_KEY, 'detail', course.id], course)
      client.invalidateQueries({ queryKey: [COURSES_KEY, 'list'] })
    },
  })
}

export function useDeleteCourses() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => coursesApi.remove(ids),
    onSuccess: () => client.invalidateQueries({ queryKey: [COURSES_KEY] }),
  })
}

/** The category picker on the course form. */
/**
 * Everything the course form needs to offer as a choice.
 *
 * One hook rather than four queries in the component, so the form does not
 * decide when each list loads — and so the FAQ, review and course pickers are
 * populated from the same modules that own those records, per §39. Nothing
 * here is course-specific: it is cached under its own keys and shared by every
 * course form the editor opens.
 */
export function useCourseReferenceData() {
  const categories = useQuery({
    queryKey: ['categories', 'options'],
    queryFn: () => categoriesApi.list({ page: 1, pageSize: 200 }),
  })

  const faqs = useQuery({
    queryKey: ['faqs', 'options'],
    queryFn: () => faqsApi.list({ page: 1, pageSize: 200 }),
  })

  const reviews = useQuery({
    queryKey: ['reviews', 'options'],
    queryFn: () => reviewsApi.list({ page: 1, pageSize: 200 }),
  })

  const courses = useQuery({
    queryKey: ['courses', 'options'],
    queryFn: () => coursesApi.list({ page: 1, pageSize: 200 }),
  })

  /** Enough of the text to recognise the record, without breaking the row. */
  const clip = (text: string, length = 70) =>
    text.length > length ? `${text.slice(0, length - 1)}…` : text

  return {
    categoryOptions: (categories.data?.items ?? []).map((item) => ({
      value: item.id,
      label: item.name,
    })),
    faqOptions: (faqs.data?.items ?? []).map((item) => ({
      value: item.id,
      label: clip(item.question),
    })),
    reviewOptions: (reviews.data?.items ?? []).map((item) => ({
      value: item.id,
      label: `${item.authorName} — ${clip(item.quote, 50)}`,
    })),
    courseOptions: (courses.data?.items ?? []).map((item) => ({
      value: item.id,
      label: `${item.title} (${item.segment})`,
    })),
    loading: categories.isLoading,
  }
}
