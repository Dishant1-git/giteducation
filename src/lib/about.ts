/**
 * Content for /about.
 *
 * Every figure on the page is derived from data the site already holds (the
 * course menu, the certificate programs, the founding year), so nothing here
 * can drift out of step with the rest of the site. Add a founder, team or awards
 * only once they are confirmed; the page has no placeholder for them.
 */

import { certificatePrograms, courseGroups, SITE } from "@/lib/site";

const courseCount = courseGroups.reduce((total, group) => total + group.items.length, 0);

export const ABOUT_STATS: [value: string, label: string][] = [
  [`${new Date().getFullYear() - SITE.established}+`, "Years of teaching"],
  [`${courseCount}+`, "Courses & software taught"],
  [String(certificatePrograms.length), "Certificate programs"],
  [String(courseGroups.length), "Subject areas"],
];

export const AUDIENCES: { title: string; text: string }[] = [
  { title: "School students", text: "Computer basics, typing and MS Office before board exams and college." },
  { title: "College students", text: "Industrial training, projects and software their degree now expects." },
  { title: "Job seekers", text: "Tally, Excel and typing speed for office, accounts and government-job tests." },
  { title: "Working professionals", text: "Evening and weekend batches to add a skill without leaving work." },
  { title: "Shop & business owners", text: "Billing, GST, accounts and online marketing for their own business." },
  { title: "Homemakers & beginners", text: "A patient first start on the computer, at their own pace." },
];

export const STEPS: { title: string; text: string }[] = [
  { title: "Learn", text: "A trainer explains each topic on screen, one small step at a time." },
  { title: "Practise", text: "Every student works on their own computer with a daily practical assignment." },
  { title: "Prove", text: "A practical test checks the work before the certificate is issued." },
  { title: "Progress", text: "CV help, interview preparation and job leads for the next step." },
];

export const DIFFERENCES: { icon: string; title: string; text: string }[] = [
  { icon: "monitor", title: "One computer per student", text: "Nobody shares a screen or waits for a turn during practical time." },
  { icon: "document", title: "Daily practical assignments", text: "Each class ends with work on the computer, checked by the trainer." },
  { icon: "clock", title: "Batches that fit your day", text: "Morning, evening and weekend timings, so study fits around school or work." },
  { icon: "users", title: "Small batches", text: "Trainers sit with each student until the work feels easy." },
  { icon: "certificate", title: "Certificate on completion", text: "Issued after a practical assessment, with the course and duration on it." },
  { icon: "briefcase", title: "Placement help", text: "CV building, mock interviews and job leads once the course is done." },
];

export const PRINCIPLES: { title: string; text: string }[] = [
  { title: "Practical first", text: "Most class time is spent doing the work on a computer, not reading about it." },
  { title: "Skills that get used", text: "We teach the software offices, businesses and design firms in Punjab actually run." },
  { title: "Nobody left behind", text: "Doubts are cleared in class, and the lab stays open for extra practice." },
];

export const MISSION =
  "To give every student in Jalandhar practical, affordable computer training that leads to real work: a job, a promotion, or a business run better.";

export const VISION =
  "A place where anyone, from a first-time computer user to a working professional, can learn a job-ready skill close to home.";

/* ---------- /about/mission-vision ---------- */

export const MISSION_GOALS: { icon: string; title: string; text: string }[] = [
  { icon: "users", title: "Open to every learner", text: "Courses for school students, graduates, working people and complete beginners alike." },
  { icon: "keyboard", title: "Practice over theory", text: "Most class time spent on the computer, with a practical assignment every day." },
  { icon: "briefcase", title: "Skills employers use", text: "Tally, Excel, typing, CAD and design: the software offices and firms here actually run." },
  { icon: "rupee", title: "Fair, clear fees", text: "Fees and instalment options explained in full before admission." },
  { icon: "target", title: "A next step for everyone", text: "CV help, interview preparation and job leads once the course is complete." },
];

export const VISION_POINTS: string[] = [
  "Every student leaves able to do the work, not just describe it",
  "Practical computer skills within reach of every family in Jalandhar",
  "Certificates that local employers recognise and trust",
  "Courses that keep pace with the software offices move to",
  "An institute students recommend to their own brothers and sisters",
];

/* ---------- /about/accreditations-awards ---------- */

export type Credential = { icon: string; title: string; issuer: string; since?: string; text: string; points: string[] };

/**
 * Credentials the institute actually holds. Add ISO, MSME (Udyam) or other
 * registrations here only with the certificate number in hand; each card is
 * shown exactly as written.
 */
export const CREDENTIALS: Credential[] = [
  {
    icon: "shield",
    title: "Registered institute",
    issuer: SITE.registration,
    since: String(SITE.established),
    text: `${SITE.name} is a registered computer training institute in ${SITE.address.locality}, teaching from its centre on ${SITE.address.street} since ${SITE.established}.`,
    points: ["Registration number shown on every certificate", "Fixed address you can visit before enrolling", "Written fee receipt for every payment"],
  },
];

export type Award = { title: string; by: string; year: string; text?: string };

/** Awards and recognitions received. The section is hidden while this is empty. */
export const AWARDS: Award[] = [];

export const WHY_CHECK: { icon: string; title: string; text: string }[] = [
  { icon: "building", title: "A real, registered centre", text: "Visit the institute, see the lab and meet a trainer before you pay. A registered address is the first thing to check." },
  { icon: "certificate", title: "A certificate you can verify", text: "Ask to see a sample certificate. It should carry the course, duration, registration number and a way to verify it." },
  { icon: "receipt", title: "Fees in writing", text: "Every fee and instalment should come with a written receipt from the institute, not a verbal promise." },
  { icon: "users", title: "Reviews from real students", text: "Read what past students say, and ask to speak to one who took the course you are considering." },
];

/* ---------- /about/team ---------- */

/** `photo` is a path under /public, e.g. "/images/team/name.jpg". Without one, initials are shown. */
export type TeamMember = { name: string; role: string; photo?: string };

const teamPhoto = (file: string) => encodeURI(`/images/teamsimages/WhatsApp Image ${file}.jpeg`);

/**
 * The people at the institute, in marquee order. Add each person only with
 * their consent to be listed; role cards are shown instead while this is empty.
 */
export const TEAM: TeamMember[] = [
  { name: "Gourav Gupta", role: "Founder & CEO", photo: teamPhoto("2026-08-21 at 7.22.51 PM") },
  { name: "Shilpa Gupta", role: "Team Member", photo: teamPhoto("2026-08-21 at 8.13.37 PM") },
  { name: "Asmita Sehgal", role: "Team Member", photo: teamPhoto("2026-08-21 at 7.12.14 PM") },
  { name: "Daljeet Singh", role: "Team Member", photo: teamPhoto("2026-08-21 at 9.12.04 PM") },
  { name: "Harrachneet Kaur", role: "Team Member", photo: teamPhoto("2026-08-21 at 8.33.14 PM") },
  { name: "Alam", role: "Team Member", photo: teamPhoto("2026-08-21 at 8.41.45 PM") },
  { name: "Tanisha", role: "Team Member", photo: teamPhoto("2026-08-22 at 8.29.34 AM") },
  { name: "Sandeep Chugh", role: "Team Member", photo: teamPhoto("2026-08-21 at 8.37.58 PM") },
  { name: "Anita Sharma", role: "Team Member", photo: teamPhoto("2026-08-21 at 8.35.31 PM") },
  { name: "Shiv", role: "Team Member", photo: teamPhoto("2026-08-21 at 8.43.52 PM") },
  { name: "Aman Sharma", role: "Team Member", photo: teamPhoto("2026-08-21 at 8.49.51 PM") },
];

export const TEAM_ROLES: { icon: string; title: string; text: string }[] = [
  { icon: "monitor", title: "Trainers", text: "Teach each batch on the computer, check the daily practical work and prepare students for the final test." },
  { icon: "users", title: "Counsellors", text: "Help you choose a course and a batch timing, and explain fees and instalments before you enrol." },
  { icon: "briefcase", title: "Placement help", text: "Build CVs, run mock interviews and share job leads with students who complete their course." },
  { icon: "building", title: "Front desk & lab", text: "Handle admissions, receipts and certificates, and keep the lab open for extra practice." },
];

export const FUTURE_TEXT =
  "Offices keep moving to new software, and so do we. As AI tools, online accounting and digital marketing change what employers ask for, we add them to the syllabus, so what a student learns here is still what gets them hired.";
