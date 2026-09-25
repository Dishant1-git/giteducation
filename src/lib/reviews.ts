import { COURSES } from "./courses";

export type StudentReview = {
  initials: string;
  name: string;
  role: string;
  text: string;
  course: string;
  href: string;
};

/**
 * The /reviews page shows one review from each of these courses, in this order.
 * The text comes from the course's own `reviews` in courses.ts, so the page and
 * the course pages never disagree.
 */
const PICKS = [
  "tally-prime-course-in-jalandhar",
  "punjabi-typing-course-in-jalandhar",
  "cad-cam-course-in-jalandhar",
  "advance-excel-course-in-jalandhar",
  "digital-marketing-course-in-jalandhar",
  "artificial-intelligence-course-in-jalandhar",
  "basic-computer-course-in-jalandhar",
];

export const REVIEWS: StudentReview[] = PICKS.flatMap((slug) => {
  const course = COURSES.find((c) => c.slug === slug);
  const review = course?.reviews[0];
  if (!course || !review) return [];
  return [{ ...review, course: course.shortTitle, href: `/courses/${course.slug}` }];
});
