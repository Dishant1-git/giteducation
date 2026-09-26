/**
 * General questions, shown on the home page and as the first tab of /faq.
 *
 * Course-specific questions live with each course in src/lib/courses.ts, and the
 * /faq page reads them from there, so a course page and the FAQ page never disagree.
 */

export const GENERAL_FAQS: [question: string, answer: string][] = [
  ["I have never used a computer. Can I join?", "Yes. Start with our Basic Computer course. It begins from switching on the computer and goes step by step. No prior knowledge is needed."],
  ["How long are the courses?", "Most courses run from 1 to 6 months depending on the course. Basic Computer and typing batches are shorter, and CAD/CAM and diploma courses are longer."],
  ["Is Tally taught with GST?", "Yes. Tally Prime is taught with GST, TDS, payroll and inventory, using practical entries like the ones in real businesses."],
  ["Will Punjabi typing help with government job tests?", "Yes. We teach Raavi and Asees fonts with daily timed practice so you reach the speed that recruitment tests ask for."],
  ["Will I get a certificate?", "Yes. You get a certificate on completing the course and passing the final test."],
  ["Can I pay the fees in instalments?", "Yes, fees can be paid in easy instalments. Visit us or call for current fees and batch timings."],
];
