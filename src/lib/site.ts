/**
 * Single source of truth for site identity, contact details and navigation.
 * Components read these values instead of hard-coding strings, so a change to a
 * phone number or a nav label propagates everywhere at once.
 */

export const SITE = {
  name: "GIT Education",
  legalName: "GIT Education — Computer Training Institute",
  tagline: "Computer Training Institute, Jalandhar",
  url: "https://giteducation.org",
  phone: "+91 00000 00000",
  whatsapp: "910000000000",
  email: "info@giteducation.org",
  address: {
    street: "Model Town Road",
    locality: "Jalandhar",
    region: "Punjab",
    postalCode: "144001",
    country: "IN",
  },
  hours: "Mon – Sat, 8:00 AM – 7:00 PM",
  established: 2016,
  registration: "Regd. No. GIT/JAL/2016/0412",
} as const;

export const TEL_HREF = `tel:${SITE.phone.replace(/\s/g, "")}`;
export const MAIL_HREF = `mailto:${SITE.email}`;
export const WHATSAPP_HREF = `https://wa.me/${SITE.whatsapp}`;

/**
 * Gmail compose link with the institute's address, subject and message filled in.
 * Opens in the browser, so it works on computers with no mail app set up.
 */
export const gmailComposeHref = ({ subject, body }: { subject: string; body: string }) =>
  `https://mail.google.com/mail/?${new URLSearchParams({ view: "cm", fs: "1", to: SITE.email, su: subject, body })}`;

/** Default enquiry email for a course or certificate program. */
export const courseEnquiryEmail = (courseName: string) =>
  gmailComposeHref({
    subject: `Enquiry: ${courseName} – ${SITE.name}, ${SITE.address.locality}`,
    body: [
      "Hello GIT Education team,",
      "",
      `I am interested in the ${courseName} at your ${SITE.address.locality} centre. Please share:`,
      "",
      "1. Fees and instalment options",
      "2. Upcoming batch dates and timings",
      "3. Course duration and syllabus",
      "4. A slot for a free demo class",
      "",
      "My name: ",
      "My phone number: ",
      "",
      "Thank you.",
    ].join("\n"),
  });

/** Primary navigation. Every href is a real route or a hash on the home page. */
export const navLinks: [label: string, href: string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Courses", "/courses"],
  ["Certificate Programs", "/certificate-programs"],
  ["Why Us", "/#difference"],
  ["Reviews", "/reviews"],
  ["Resources", "/#faq"],
  ["Branches", "/#contact"],
  ["Contact", "/contact"],
];

export type CourseMenuItem = { label: string; slug?: string; badge?: string };

/** Where a menu course links: its own page when one exists, otherwise the course listing. */
export const courseHref = (item: CourseMenuItem) => (item.slug ? `/courses/${item.slug}` : "/courses");

/** Courses mega-menu columns, one group per column. */
export const courseGroups: { title: string; blurb: string; items: CourseMenuItem[] }[] = [
  {
    title: "Basics & Accounting",
    blurb: "Office, typing, GST and billing skills",
    items: [
      { label: "Basic Computer", slug: "basic-computer-course-in-jalandhar" },
      { label: "MS Office", slug: "ms-office-course-in-jalandhar" },
      { label: "Advance Excel", slug: "advance-excel-course-in-jalandhar" },
      { label: "Google Workspace" },
      { label: "CAT Pro" },
      { label: "Punjabi Typing", slug: "punjabi-typing-course-in-jalandhar" },
      { label: "English Typing", slug: "english-typing-course-in-jalandhar" },
      { label: "Tally ERP-9" },
      { label: "Tally Prime", slug: "tally-prime-course-in-jalandhar" },
      { label: "QuickBooks" },
    ],
  },
  {
    title: "Digital Marketing",
    blurb: "Promote a business online",
    items: [
      { label: "Digital Marketing", slug: "digital-marketing-course-in-jalandhar", badge: "New" },
      { label: "SEO" },
      { label: "SMO" },
      { label: "Google Ads" },
      { label: "Meta Ads" },
    ],
  },
  {
    title: "Graphic Design",
    blurb: "Graphics and print design",
    items: [
      { label: "Graphic Design", slug: "graphic-design-course-in-jalandhar" },
      { label: "Photoshop" },
      { label: "Illustrator" },
    ],
  },
  {
    title: "CAD / CAM",
    blurb: "Mechanical and civil design",
    items: [
      { label: "AutoCAD" },
      { label: "SolidWorks" },
      { label: "CNC Programming" },
      { label: "WorkNC" },
      { label: "SolidCAM" },
      { label: "3ds Max" },
      { label: "Revit" },
      { label: "SketchUp" },
      { label: "STAAD Pro" },
      { label: "ETABS" },
    ],
  },
  {
    title: "Programming & AI",
    blurb: "Python, AI and websites",
    items: [
      { label: "Core Python" },
      { label: "Generative AI" },
      { label: "Web Designing" },
      { label: "Web Development with Python" },
      { label: "WordPress" },
    ],
  },
];

/** Certificate Programs menu: icon cards (icon = key in `lineIcons`), each linking to its own page at /certificate-programs/[slug]. */
export type CertificateMenuItem = { label: string; icon: string; slug: string; badge?: string };

export const certificatePrograms: CertificateMenuItem[] = [
  { label: "Basic Computer", icon: "monitor", slug: "basic-computer-certificate-program-in-jalandhar" },
  { label: "MS Office", icon: "document", slug: "ms-office-certificate-program-in-jalandhar" },
  { label: "Advance Excel", icon: "chart", slug: "advance-excel-certificate-program-in-jalandhar" },
  { label: "Tally Prime / ERP", icon: "receipt", slug: "tally-prime-erp-certificate-program-in-jalandhar" },
  { label: "Punjabi Typing", icon: "keyboard", slug: "punjabi-typing-certificate-program-in-jalandhar" },
  { label: "CAD / CAM", icon: "cube", slug: "cad-cam-certificate-program-in-jalandhar" },
  { label: "Graphic Design", icon: "pen", slug: "graphic-design-certificate-program-in-jalandhar" },
  { label: "English Typing", icon: "type", slug: "english-typing-certificate-program-in-jalandhar" },
  { label: "DTP & Printing", icon: "printer", slug: "dtp-printing-certificate-program-in-jalandhar" },
];

export const certificateHref = (slug: string) => `/certificate-programs/${slug}`;

/** Branches. Some run their own site and open in a new tab. */
export const branches: { city: string; href: string; external?: boolean }[] = [
  { city: "Jalandhar", href: "https://techcaddjalandhar.com/", external: true },
  { city: "Chandigarh", href: "/#contact" },
  { city: "Mohali", href: "/#contact" },
  { city: "Ludhiana", href: "https://techcaddludhiana.com/", external: true },
  { city: "Phagwara", href: "https://techcaddphagwara.in/", external: true },
  { city: "Amritsar", href: "/#contact" },
  { city: "Hoshiarpur", href: "/#contact" },
];

export type MegaMenuData = {
  links: { label: string; href: string; badge?: string }[];
  featured: { title: string; href: string; image: string; tag: string; meta: string }[];
  cta: { label: string; href: string };
};

/** Header mega menus, keyed by nav label. */
export const megaMenus: Record<string, MegaMenuData> = {
  About: {
    links: [
      { label: "About GIT Education", href: "/about" },
      { label: "Mission and Vision", href: "/about/mission-vision" },
      { label: "Accreditations & Awards", href: "/about/accreditations-awards" },
      { label: "Our Team", href: "/about/team" },
    ],
    featured: [
      { title: "About GIT Education", href: "/about", image: "/images/about/alpine-college-team-with-faculty.jpeg", tag: "Story", meta: "Since 2016" },
      { title: "Mission and Vision", href: "/about/mission-vision", image: "/images/about/alpine-college-full-hall.jpeg", tag: "Purpose", meta: "Our direction" },
      { title: "Our Team", href: "/about/team", image: "/images/about/team.jpg", tag: "People", meta: "Trainers & mentors" },
    ],
    cta: { label: "Talk to a counsellor", href: "/#contact" },
  },
  Resources: {
    links: [
      { label: "Find My Career Track", href: "/tools/career-track-finder", badge: "New" },
      { label: "Training Matcher", href: "/tools/training-matcher", badge: "New" },
      { label: "Salary Estimator", href: "/tools/salary-estimator", badge: "New" },
      { label: "Blogs", href: "/blogs" },
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
      { label: "FAQ", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
      { label: "College Partnerships", href: "/college-partnerships" },
    ],
    featured: [
      { title: "Find My Career Track", href: "/tools/career-track-finder", image: "/images/tools/career-track-finder.png", tag: "Free Tool", meta: "4 Questions" },
      { title: "Training Matcher", href: "/tools/training-matcher", image: "/images/tools/training-matcher.png", tag: "Free Tool", meta: "Instant Match" },
      { title: "Salary Estimator", href: "/tools/salary-estimator", image: "/images/tools/salary-estimator.png", tag: "Free Tool", meta: "Punjab & NCR" },
    ],
    cta: { label: "Ask us a question", href: "/#contact" },
  },
};

/** 24px-grid stroked line icons, shared by the header, footer and course pages. */
export const lineIcons: Record<string, string> = {
  monitor: "M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M8 20h8 M12 16v4",
  document: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h6",
  chart: "M4 20h16 M7 16v-4 M12 16V8 M17 16v-7",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6 M9 16h3",
  keyboard: "M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M6 10h.01 M10 10h.01 M14 10h.01 M18 10h.01 M7 14h10",
  cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5",
  pen: "M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.6 7.6",
  type: "M4 7V4h16v3 M9 20h6 M12 4v16",
  printer: "M6 9V3h12v6 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v7H6z",
  brain: "M9.5 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8V20 M14.5 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8V20 M9.5 4a3 3 0 0 1 2.5 3v13 M14.5 4a3 3 0 0 0-2.5 3",
  megaphone: "M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z M16 9a4 4 0 0 1 0 6 M19 6a8 8 0 0 1 0 12",
  shield: "M12 3l8 3v6c0 4.4-3.2 8.2-8 9-4.8-.8-8-4.6-8-9V6l8-3z M9 12l2 2 4-4",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
  users: "M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20 M9 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7 M22 20v-1.5a4 4 0 0 0-3-3.9 M16 3.6a4 4 0 0 1 0 7.7",
  briefcase: "M4 8h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1z M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2 M3 13h18",
  certificate: "M12 3l2.2 1.6 2.7-.2.9 2.6 2.2 1.6-1 2.5 1 2.5-2.2 1.6-.9 2.6-2.7-.2L12 19.4 9.8 17.8l-2.7.2-.9-2.6L4 13.8l1-2.5-1-2.5 2.2-1.6.9-2.6 2.7.2z M9 20.5l3-1.1 3 1.1",
  sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8z",
  rupee: "M6 4h12 M6 9h12 M15 4c2.5 0 4 1.8 4 4s-1.5 4-4 4H9l8 8",
  location: "M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z",
  mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M3.5 6.5 12 13l8.5-6.5",
  download: "M12 3v12 M8 11l4 4 4-4 M4 20h16",
  check: "M5 12.5 9.5 17 19 7",
  calendar: "M4 6h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z M8 3v5 M16 3v5 M3 11h18",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 11.2a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6z",
  book: "M4 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4z M20 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20z",
  code: "M9 17 4 12l5-5 M15 7l5 5-5 5 M13 4l-2 16",
  building: "M4 21h16 M6 21V7l6-4 6 4v14 M10 21v-4h4v4 M9 10h.01 M15 10h.01 M9 14h.01 M15 14h.01",
  chip: "M7 7h10v10H7z M10 10h4v4h-4z M9 3v4 M15 3v4 M9 17v4 M15 17v4 M3 9h4 M3 15h4 M17 9h4 M17 15h4",
  robot: "M8 8h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z M12 4v4 M9 13h.01 M15 13h.01 M9 17h6 M2 12v3 M22 12v3",
};

export const footerCols: [heading: string, links: [label: string, href: string][]][] = [
  [
    "Courses",
    [
      ["Basic Computer", "/courses/basic-computer-course-in-jalandhar"],
      ["MS Office", "/courses/ms-office-course-in-jalandhar"],
      ["Advance Excel", "/courses/advance-excel-course-in-jalandhar"],
      ["Tally Prime", "/courses/tally-prime-course-in-jalandhar"],
    ],
  ],
  [
    "More Courses",
    [
      ["Punjabi Typing", "/courses/punjabi-typing-course-in-jalandhar"],
      ["English Typing", "/courses/english-typing-course-in-jalandhar"],
      ["CAD / CAM", "/courses/cad-cam-course-in-jalandhar"],
      ["Graphic Design", "/courses/graphic-design-course-in-jalandhar"],
    ],
  ],
  [
    "Institute",
    [
      ["About Us", "/about"],
      ["Gallery", "/gallery"],
      ["Reviews", "/reviews"],
      ["Contact Us", "/contact"],
    ],
  ],
  [
    "Support",
    [
      ["FAQs", "/faq"],
      ["Placement Help", "/contact"],
      ["Enquire Now", "/contact#enquire"],
    ],
  ],
];
