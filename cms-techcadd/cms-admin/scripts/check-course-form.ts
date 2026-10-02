/**
 * Does the course form's blank state satisfy the course form's own schema?
 *
 * The failure this catches is invisible to typechecking and to the build: a
 * field added to the schema but not to `emptyCourse()` arrives as `undefined`,
 * zodResolver rejects the record the moment the form mounts, and the editor
 * sees "check the highlighted fields" against a field with no input to
 * highlight. It is the exact bug the comment above `reset()` already describes
 * having been hit once.
 *
 * Run: npm run check:form
 */
import { courseSchema, emptyCourse } from '../src/features/courses/courseSchema'

const blank = emptyCourse()
const parsed = courseSchema.safeParse(blank)

/**
 * A blank form is *supposed* to fail on these three — they are the fields a
 * course cannot exist without, and the editor fills them in first. Anything
 * else failing means a field was added to the schema and not to the defaults,
 * which is the bug this check exists for.
 */
const EXPECTED_BLANKS = new Set(['title', 'slug', 'shortDescription'])

const unexpected = parsed.success
  ? []
  : parsed.error.issues.filter((issue) => !EXPECTED_BLANKS.has(String(issue.path[0])))

if (unexpected.length === 0) {
  console.log(
    `PASS  emptyCourse() has a valid default for every field (${Object.keys(blank).length} fields; ` +
      `only ${[...EXPECTED_BLANKS].join(', ')} left for the editor)`,
  )
} else {
  console.log('FAIL  fields in the schema with no usable default:')
  for (const issue of unexpected) {
    console.log(`        ${issue.path.join('.') || '(root)'}: ${issue.message}`)
  }
  process.exitCode = 1
}

/**
 * And a course as the API actually returns one — the load path, which is where
 * a number arriving where the form wants text would bite.
 */
const fromApi = {
  ...blank,
  title: 'Example',
  slug: 'example',
  shortDescription: 'Short.',
  plans: [{ id: 'p1', label: 'Practitioner', months: '3', summary: '', badge: '', popular: false }],
  syllabus: [
    {
      id: 'm1',
      title: 'Module one',
      topics: ['a'],
      body: '',
      outcomes: [],
      tools: [],
      project: '',
      fromPlan: '1',
    },
  ],
  facts: [{ id: 'f1', label: 'Duration', value: '3 Months', icon: '', suffix: '' }],
  audience: [{ id: 'a1', title: 'Graduates', body: 'For graduates.' }],
  careerRoles: [
    { id: 'c1', role: 'Analyst', body: '', salaryStart: '', salarySenior: '', market: '' },
  ],
  comparisonRows: [{ id: 'r1', feature: 'Trainers', ours: 'Practitioners', theirs: 'Lecturers' }],
}

const loaded = courseSchema.safeParse(fromApi)
if (loaded.success) {
  console.log('PASS  a populated course satisfies courseSchema')
} else {
  console.log('FAIL  a populated course does not:')
  for (const issue of loaded.error.issues) {
    console.log(`        ${issue.path.join('.') || '(root)'}: ${issue.message}`)
  }
  process.exitCode = 1
}
