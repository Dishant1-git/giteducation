"use client";

import Image from "next/image";
import Lenis from "lenis";
import { Fragment, useEffect, useRef, useState } from "react";

const PHONE = "+91 00000 00000";
const EMAIL = "info@giteducation.org";

const navLinks = [
  ["Home", "#top"],
  ["About", "#about"],
  ["Courses", "#courses"],
  ["Certificate Programs", "#categories"],
  ["Why Us", "#difference"],
  ["Reviews", "#reviews"],
  ["Resources", "#faq"],
  ["Branches", "#contact"],
  ["Contact", "#contact"],
];

// Courses mega menu columns
const courseGroups: { title: string; blurb: string; items: { label: string; badge?: string }[] }[] = [
  {
    title: "Office & Basics",
    blurb: "Everyday computer and office skills",
    items: [{ label: "Basic Computer" }, { label: "MS Office" }, { label: "Advance Excel" }],
  },
  {
    title: "Accounts & Typing",
    blurb: "Accounting, GST and typing for jobs and exams",
    items: [{ label: "Tally Prime / ERP" }, { label: "Punjabi Typing" }, { label: "English Typing" }],
  },
  {
    title: "Design & CAD",
    blurb: "Drafting, graphics and print design",
    items: [{ label: "CAD / CAM" }, { label: "Graphic Design" }, { label: "DTP & Printing" }],
  },
  {
    title: "Digital Marketing",
    blurb: "Promote a business online",
    items: [{ label: "Digital Marketing", badge: "New" }],
  },
];

// Line icons (24px grid, stroked) for the Certificate Programs cards
const programIcons: Record<string, string> = {
  monitor: "M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M8 20h8 M12 16v4",
  document: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h6",
  chart: "M4 20h16 M7 16v-4 M12 16V8 M17 16v-7",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6 M9 16h3",
  keyboard: "M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M6 10h.01 M10 10h.01 M14 10h.01 M18 10h.01 M7 14h10",
  cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5",
  pen: "M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.6 7.6",
  type: "M4 7V4h16v3 M9 20h6 M12 4v16",
  printer: "M6 9V3h12v6 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v7H6z",
};

const certificatePrograms: { label: string; icon: string; badge?: string }[] = [
  { label: "Basic Computer", icon: "monitor" },
  { label: "MS Office", icon: "document" },
  { label: "Advance Excel", icon: "chart" },
  { label: "Tally Prime / ERP", icon: "receipt" },
  { label: "Punjabi Typing", icon: "keyboard" },
  { label: "CAD / CAM", icon: "cube" },
  { label: "Graphic Design", icon: "pen" },
  { label: "English Typing", icon: "type" },
  { label: "DTP & Printing", icon: "printer" },
];

// Branches with their own website open in a new tab
const branches = [
  { city: "Chandigarh", href: "#contact" },
  { city: "Mohali", href: "#contact" },
  { city: "Ludhiana", href: "https://techcaddludhiana.com/", external: true },
  { city: "Phagwara", href: "https://techcaddphagwara.in/", external: true },
  { city: "Jalandhar", href: "#contact" },
  { city: "Amritsar", href: "#contact" },
  { city: "Hoshiarpur", href: "#contact" },
];

type MegaMenuData = {
  links: { label: string; href: string; badge?: string }[];
  featured: { title: string; href: string; image: string; tag: string; meta: string }[];
  cta: { label: string; href: string };
};

// Header mega menus, keyed by nav label
const megaMenus: Record<string, MegaMenuData> = {
  About: {
    links: [
      { label: "About techcadd", href: "#about" },
      { label: "Mission and Vision", href: "#about" },
      { label: "Accreditations & Awards", href: "#about" },
      { label: "Our Team", href: "#about" },
    ],
    featured: [
      { title: "About techcadd", href: "#about", image: "/images/about/alpine-college-team-with-faculty.jpeg", tag: "Story", meta: "Since 2016" },
      { title: "Mission and Vision", href: "#about", image: "/images/about/alpine-college-full-hall.jpeg", tag: "Purpose", meta: "Our direction" },
      { title: "Our Team", href: "#about", image: "/images/about/team.jpg", tag: "People", meta: "Trainers & mentors" },
    ],
    cta: { label: "Talk to a counsellor", href: "#contact" },
  },
  Resources: {
    links: [
      { label: "Find My Career Track", href: "#contact", badge: "New" },
      { label: "Training Matcher", href: "#contact", badge: "New" },
      { label: "Salary Estimator", href: "#contact", badge: "New" },
      { label: "Blogs", href: "#contact" },
      { label: "Events", href: "#contact" },
      { label: "Gallery", href: "#contact" },
      { label: "FAQ", href: "#faq" },
      { label: "Reviews", href: "#reviews" },
      { label: "College Partnerships", href: "#contact" },
    ],
    featured: [
      { title: "Find My Career Track", href: "#contact", image: "/images/tools/career-track-finder.png", tag: "Free Tool", meta: "4 Questions" },
      { title: "Training Matcher", href: "#contact", image: "/images/tools/training-matcher.png", tag: "Free Tool", meta: "Instant Match" },
      { title: "Salary Estimator", href: "#contact", image: "/images/tools/salary-estimator.png", tag: "Free Tool", meta: "Punjab & NCR" },
    ],
    cta: { label: "Ask us a question", href: "#contact" },
  },
};

const steps = [
  ["Day 1", "Counselling", "Tell us your goal (job, business or exam) and we'll suggest the right course and batch timing."],
  ["Classes", "Daily practicals", "Small batches with one computer per student and a trainer to help you in every class."],
  ["Practice", "Real assignments", "Work on real office files, GST invoices, drawings and designs, not just theory."],
  ["Completion", "Certificate & jobs", "Take the final test, get your certificate and get help with your CV and job interviews."],
];

const categories = [
  ["Basic Computer", "Windows, internet, email, typing basics and everyday computer use.", "from-brand-600 to-accent-500", "💻"],
  ["MS Office", "Word, Excel, PowerPoint and Outlook for office and school work.", "from-brand-700 to-brand-500", "📄"],
  ["Advance Excel", "Formulas, VLOOKUP/XLOOKUP, pivot tables, dashboards and macros.", "from-emerald-600 to-accent-500", "📊"],
  ["Tally Prime / ERP", "Accounting, inventory, GST, TDS and payroll with Tally Prime.", "from-ink to-brand-700", "🧾"],
  ["Punjabi Typing", "Gurmukhi typing in Raavi and Asees fonts for government job tests.", "from-brand-500 to-accent-glow", "⌨️"],
  ["CAD / CAM", "AutoCAD, SolidWorks, CATIA, Creo and Revit for engineers and architects.", "from-logo to-brand-600", "📐"],
  ["Graphic Design", "Photoshop, CorelDRAW, Illustrator and InDesign for print and social media.", "from-violet-600 to-brand-500", "🎨"],
  ["English Typing", "Build speed and accuracy for clerk, steno and data-entry exams.", "from-accent-500 to-brand-700", "🔤"],
  ["DTP & Printing", "Page layout, visiting cards, flex banners and wedding cards.", "from-brand-700 to-violet-500", "🖨️"],
];

const differences = [
  ["Practical, job-ready syllabus", "Every course is built around the work you'll actually do in an office, shop, CA firm or design studio."],
  ["Experienced trainers", "Learn from trainers who have taught thousands of students and still work with these tools every day."],
  ["Placement assistance", "CV help, interview practice and job leads with local offices, accountants, shops and design firms."],
  ["Flexible batches", "Morning, evening and weekend batches, 1-month to 6-month courses and easy fee instalments."],
];

const reviews = [
  ["SK", "Simran K.", "Accounts Assistant, Jalandhar", "The Tally with GST course was very practical. I learned billing and returns on real entries and got a job at a CA office.", "from-brand-600 to-brand-400"],
  ["HS", "Harpreet S.", "Clerk (Punjab Govt.)", "Daily Punjabi typing practice in Raavi font helped me clear my typing test easily. Thank you to the whole team!", "from-accent-500 to-accent-400"],
  ["AV", "Arjun V.", "Draughtsman, Phagwara", "AutoCAD and SolidWorks were taught with real drawings. I built a portfolio that got me hired.", "from-ink to-brand-700"],
  ["NB", "Navneet B.", "Graphic Designer, Ludhiana", "I learned Photoshop and CorelDRAW from scratch. Now I design banners and wedding cards for my own clients.", "from-brand-700 to-accent-500"],
  ["RM", "Rohit M.", "MIS Executive, Mohali", "The Advance Excel pivot tables and dashboards changed my career. My manager noticed the difference in a week.", "from-brand-500 to-accent-400"],
  ["GS", "Gurleen S.", "Student, 12th pass", "I started with the basic computer course and MS Office. The teachers are patient and the lab is always open for practice.", "from-ink to-brand-500"],
];

const modules = [
  ["Certificate", "A course completion certificate, useful for job applications and government forms."],
  ["One computer per student", "Your own system in every class, with licensed software and plenty of practice time."],
  ["Practical projects", "Real invoices, spreadsheets, engineering drawings and design work you can show employers."],
  ["Typing speed tests", "Regular timed tests in English and Punjabi, with speed and accuracy tracked each week."],
  ["Interview & job support", "CV making, mock interviews and job leads when you finish your course."],
];

const softwareTabs: Record<string, string[]> = {
  "Basic & Office": ["Windows", "Internet & Email", "MS Word", "MS Excel", "MS PowerPoint", "MS Outlook", "Google Docs", "Google Sheets"],
  "Advance Excel": ["VLOOKUP / XLOOKUP", "Pivot Tables", "Charts & Dashboards", "Conditional Formatting", "Data Validation", "Power Query", "Macros & VBA", "MIS Reports"],
  Accounting: ["Tally Prime", "Tally ERP 9", "GST Returns", "TDS", "Payroll", "Inventory", "Busy Accounting", "E-way Bill"],
  Typing: ["Punjabi (Raavi)", "Punjabi (Asees)", "Gurmukhi Unicode", "English Typing", "Hindi (Mangal)", "Data Entry"],
  "CAD / CAM": ["AutoCAD 2D", "AutoCAD 3D", "SolidWorks", "CATIA", "Creo", "Revit", "3ds Max", "Fusion 360"],
  Graphics: ["Photoshop", "CorelDRAW", "Illustrator", "InDesign", "PageMaker", "Canva", "Premiere Pro", "Lightroom"],
};

const careers = [
  ["Office & Data Entry", "Computer operator, receptionist, data entry and back-office jobs.", ["Basic Computer", "MS Office", "English Typing", "Internet & Email"]],
  ["Accounts & GST", "Accountant, billing executive and GST assistant roles at firms and shops.", ["Tally Prime", "GST & TDS", "Advance Excel", "Busy"]],
  ["Government Jobs", "Clerk, steno and data-entry posts that need a typing test.", ["Punjabi Typing", "English Typing", "Basic Computer", "MS Office"]],
  ["MIS & Reporting", "MIS executive and analyst roles where Excel is used every day.", ["Advance Excel", "Pivot Tables", "Dashboards", "Macros"]],
  ["Design Engineering", "Draughtsman, CAD designer and design engineer roles in industry.", ["AutoCAD", "SolidWorks", "CATIA", "Revit"]],
  ["Graphic Design & DTP", "Designer jobs at print shops, studios and agencies, or freelancing.", ["Photoshop", "CorelDRAW", "Illustrator", "InDesign"]],
] as const;

const faqs = [
  ["I have never used a computer. Can I join?", "Yes. Start with our Basic Computer course. It begins from switching on the computer and goes step by step. No prior knowledge is needed."],
  ["How long are the courses?", "Most courses run from 1 to 6 months depending on the course. Basic Computer and typing batches are shorter, and CAD/CAM and graphics courses are longer."],
  ["Is Tally taught with GST?", "Yes. Tally Prime is taught with GST, TDS, payroll and inventory, using practical entries like the ones in real businesses."],
  ["Will Punjabi typing help with government job tests?", "Yes. We teach Raavi and Asees fonts with daily timed practice so you reach the speed that recruitment tests ask for."],
  ["Will I get a certificate?", "Yes. You get a certificate on completing the course and passing the final test."],
  ["Can I pay the fees in instalments?", "Yes, fees can be paid in easy instalments. Visit us or call for current fees and batch timings."],
];

const footerCols: [string, string[]][] = [
  ["Courses", ["Basic Computer", "MS Office", "Advance Excel", "Tally Prime"]],
  ["More Courses", ["Punjabi Typing", "English Typing", "CAD / CAM", "Graphic Design"]],
  ["Institute", ["About Us", "Gallery", "Reviews", "Contact Us"]],
  ["Support", ["FAQs", "Placement Help", "Enquire Now"]],
];

const marqueeItems = ["Basic Computer", "MS Office", "Advance Excel", "Tally Prime + GST", "Punjabi Typing", "English Typing", "AutoCAD", "SolidWorks", "Photoshop", "CorelDRAW", "DTP & Printing"];

const heroWords = "Learn the computer skills that turn you into a".split(" ");

// Icons that orbit the hero visual: [icon, top, left]
const orbitIcons = [["📊", "0%", "50%"], ["📐", "50%", "100%"], ["⌨️", "100%", "50%"], ["🎨", "50%", "0%"]];

// Stagger delay for .reveal / .hero-in / .pop-in elements
const delay = (i: number, step = 90) => ({ "--d": `${i * step}ms` }) as React.CSSProperties;

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1600;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = duration ? Math.min((now - start) / duration, 1) : 1;
        setValue(to * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return <span ref={ref} className="tabular-nums">{value.toFixed(decimals)}{suffix}</span>;
}

function Pill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide ${dark ? "border-white/20 bg-white/10 text-white backdrop-blur" : "border-line bg-white text-foreground shadow-sm"}`}>
      <span className={`size-1.5 rounded-full ${dark ? "bg-accent-yellow" : "bg-brand-600"}`} />
      {children}
    </span>
  );
}

// Hand-drawn underline that draws itself when its .reveal parent appears
function Scribble({ className = "", onLoad = false }: { className?: string; onLoad?: boolean }) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" className={`scribble pointer-events-none absolute -bottom-2 left-0 h-3 w-full ${onLoad ? "scribble-load" : ""} ${className}`}>
      <path d="M3 9 C 45 3, 90 2, 118 6 S 172 10, 197 4" pathLength={1} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// Hover mega menu: link list on the left, three featured image cards on the right.
// The wrapper is deliberately not positioned, so the panel spans the whole nav
// while still sitting inside this item's hover/focus group.
function MegaMenu({ label, href, menu }: { label: string; href: string; menu: MegaMenuData }) {
  return (
    <div className="group">
      <a href={href} aria-haspopup="true" className="nav-link inline-flex items-center gap-1">
        {label}
        <svg viewBox="0 0 12 12" className="size-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </a>
      <div className="invisible absolute inset-x-0 top-full -translate-y-2 px-3 pt-2 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="mx-auto max-w-[1240px] overflow-hidden rounded-3xl border border-line/80 bg-white/95 font-sans text-foreground shadow-[0_22px_60px_-26px_rgba(15,23,42,0.32)] backdrop-blur-3xl">
          <div className="grid grid-cols-[minmax(196px,236px)_1fr] gap-8 p-6">
            <div className="flex flex-col justify-center border-r border-foreground/10 pr-8">
              <ul className="-mx-2.5">
                {menu.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[15px] leading-snug font-semibold tracking-tight text-foreground/80 transition-colors duration-200 hover:bg-brand-600/[0.06] hover:text-brand-600">
                      <span className="truncate">{l.label}</span>
                      {l.badge && <span className="ml-auto shrink-0 rounded-full bg-brand-600/10 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.08em] text-brand-600 uppercase">{l.badge}</span>}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={menu.cta.href} className="group/cta mt-5 ml-0.5 inline-flex items-center gap-2 text-[13px] font-semibold text-brand-600">
                {menu.cta.label}<span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
              </a>
            </div>
            <div className="flex flex-col justify-center">
              <ul className="grid grid-cols-3 gap-5">
                {menu.featured.map((f) => (
                  <li key={f.title}>
                    <a href={f.href} className="group/card block">
                      <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-subtle ring-1 ring-foreground/5">
                        <Image src={f.image} alt="" fill sizes="220px" className="object-cover transition-transform duration-700 group-hover/card:scale-105" />
                      </span>
                      <span className="mt-2.5 block text-[13.5px] leading-snug font-bold tracking-tight text-balance transition-colors duration-300 group-hover/card:text-brand-600">{f.title}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="rounded-md bg-brand-600/10 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.06em] text-brand-700 uppercase">{f.tag}</span>
                        <span className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">{f.meta}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({ href, children, variant = "brand" }: { href: string; children: React.ReactNode; variant?: "brand" | "white" | "panel" }) {
  const [styles, sweep, circle] = {
    brand: ["bg-brand-600 text-white", "bg-ink", "bg-white text-brand-700"],
    white: ["bg-white text-ink", "bg-accent-yellow", "bg-ink text-white"],
    panel: ["bg-panel text-white", "bg-brand-600", "bg-accent-yellow text-ink"],
  }[variant];
  return (
    <a href={href} className={`group relative isolate inline-flex shrink-0 items-center gap-3 self-start overflow-hidden rounded-full py-2 pr-2 pl-7 text-sm font-semibold shadow-lg shadow-brand-900/15 ${styles}`}>
      <span className={`absolute inset-0 -z-10 origin-left scale-x-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 ${sweep}`} />
      {children}
      <span className={`grid size-9 place-items-center rounded-full transition-transform duration-500 group-hover:-rotate-45 ${circle}`}>→</span>
    </a>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [softwareTab, setSoftwareTab] = useState("Basic & Office");
  const [career, setCareer] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTop, setShowTop] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Smooth scrolling, header state, scroll progress bar and scroll-linked hero layers
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Eased scrolling; also animates clicks on #anchor links, leaving room for the fixed header
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: -90 } });
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      setScrolled(y > 40);
      setShowTop(y > 800);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (reduceMotion || y > vh * 1.2) return;
      // Transform and opacity only, so each layer moves on the compositor without repainting
      const p = Math.min(y / vh, 1);
      if (heroRef.current) {
        heroRef.current.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(${1 - p * 0.06})`;
        heroRef.current.style.opacity = `${Math.max(0, 1 - p * 1.15)}`;
      }
      if (heroBgRef.current) heroBgRef.current.style.transform = `translate3d(0, ${y * 0.5}px, 0) scale(${1 + p * 0.2})`;
      if (orbitRef.current) orbitRef.current.style.transform = `rotate(${p * 70}deg) scale(${1 + p * 0.12})`;
      if (tickerRef.current) {
        // Ticker slides with the scroll and leans with scroll speed
        const skew = Math.max(-10, Math.min(10, lenis.velocity * -0.35));
        tickerRef.current.style.transform = `translate3d(${-y * 0.3}px, 0, 0) skewX(${skew}deg)`;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      lenis.destroy();
    };
  }, []);

  // Reveal elements with the .reveal class as they scroll into view
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    // Anything already on screen (or scrolled past) shows immediately, without animating
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
    });
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-visible");
          // Drop the stagger delay afterwards so hover effects respond instantly
          el.addEventListener("transitionend", () => el.style.setProperty("--d", "0ms"), { once: true });
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  // Pointer position for [data-pointer] elements: drives .spotlight glows, .tilt cards and the hero light
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-pointer]") : null;
      if (last && last !== el) {
        last.style.setProperty("--rx", "0deg");
        last.style.setProperty("--ry", "0deg");
      }
      last = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // The hero sets its vars on the light itself, so the rest of the hero isn't restyled
      const target = el.querySelector<HTMLElement>(":scope > .hero-spot") ?? el;
      target.style.setProperty("--mx", `${x}px`);
      target.style.setProperty("--my", `${y}px`);
      if (el.classList.contains("tilt")) {
        el.style.setProperty("--ry", `${(x / r.width - 0.5) * 12}deg`);
        el.style.setProperty("--rx", `${(0.5 - y / r.height) * 12}deg`);
      }
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  const solid = scrolled || menuOpen;
  const tel = `tel:${PHONE.replace(/\s/g, "")}`;

  return (
    <>
      <div ref={progressRef} style={{ transform: "scaleX(0)" }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-brand-500 via-violet-500 to-accent-yellow" />

      {/* Header */}
      {/* Full-width and transparent at the top; on scroll it shrinks into a centred glass pill */}
      <header className={`header-in fixed inset-x-0 top-0 z-50 transition-[padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${solid ? "px-4 pt-3" : "px-0 pt-0"}`}>
        <nav className={`relative mx-auto flex items-center justify-between border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${solid ? "max-w-[1240px] rounded-[32px] 2xl:max-w-[1400px] border-white/50 bg-white/40 px-4 py-2.5 text-foreground shadow-[0_8px_32px_-8px_rgb(13_19_48/0.18),inset_0_1px_0_rgb(255_255_255/0.6)] backdrop-blur-2xl backdrop-saturate-[1.8] [--nav-accent:var(--color-brand-600)] lg:px-6" : "max-w-full rounded-none border-transparent border-b-white/10 bg-transparent px-5 py-4 text-white lg:px-10"}`}>
          <a href="#top" aria-label="Techcadd home" className="group flex shrink-0 items-center">
            <Image
              src="/images/logo/tce.png"
              alt="Techcadd"
              width={952}
              height={262}
              preload
              className={`w-auto transition-[filter,height,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${solid ? "h-9 lg:h-10" : "h-10 brightness-0 invert lg:h-12"}`}
            />
          </a>
          <div className="hidden items-center gap-5 self-stretch text-[13px] font-medium xl:flex">
            {navLinks.slice(0, 2).map(([label, href]) =>
              megaMenus[label] ? (
                <MegaMenu key={label} label={label} href={href} menu={megaMenus[label]} />
              ) : (
                <a key={label} href={href} className="nav-link">{label}</a>
              ),
            )}
            <a href="#categories" className="shine-sweep rounded-full bg-accent-yellow px-3.5 py-1 font-semibold text-ink">New Batches</a>
            {navLinks.slice(2).map(([label, href]) =>
              label === "Courses" ? (
                // Not positioned, so the panel spans the whole nav (same as MegaMenu)
                <div key={label} className="group">
                  <a href={href} aria-haspopup="true" className="nav-link inline-flex items-center gap-1">
                    {label}
                    <svg viewBox="0 0 12 12" className="size-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <div className="invisible absolute inset-x-0 top-full -translate-y-2 px-3 pt-2 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="mx-auto max-w-[1240px] overflow-hidden rounded-3xl border border-line/80 bg-white/90 font-sans font-normal text-foreground shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] backdrop-blur-3xl">
                      <div className="grid grid-cols-4 gap-8 p-8">
                        {courseGroups.map((g, gi) => (
                          <div key={g.title}>
                            <div className="mb-4 border-b border-foreground/10 pb-3">
                              <span className="font-mono text-xs text-muted">0{gi + 1}</span>
                              <h3 className="mt-1 text-lg tracking-tight">{g.title}</h3>
                              <p className="mt-0.5 text-xs leading-relaxed text-muted">{g.blurb}</p>
                            </div>
                            <ul className="space-y-1.5">
                              {g.items.map((item) => (
                                <li key={item.label}>
                                  <a href="#categories" className="group/link flex items-start gap-2 text-sm text-foreground/70 transition-colors duration-200 hover:text-brand-600">
                                    <span className="mt-2.5 h-px w-0 shrink-0 bg-brand-600 transition-all duration-300 group-hover/link:w-3" />
                                    <span className="leading-snug">{item.label}</span>
                                    {item.badge && <span className="mt-0.5 shrink-0 rounded-full bg-brand-600/10 px-2 py-0.5 text-[10px] font-semibold text-brand-600">{item.badge}</span>}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 bg-subtle px-8 py-4">
                        <figure className="flex min-w-0 items-center gap-3">
                          <span aria-hidden="true" className="text-3xl leading-none font-bold text-brand-600/25">&ldquo;</span>
                          <blockquote className="text-sm leading-snug text-muted italic">
                            Everybody should learn to program a computer, because it teaches you how to think.
                            <cite className="ml-1.5 font-medium text-foreground not-italic">— Steve Jobs</cite>
                          </blockquote>
                        </figure>
                        <a href={href} className="group/all inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                          Browse all courses<span className="transition-transform duration-300 group-hover/all:translate-x-1">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : megaMenus[label] ? (
                <MegaMenu key={label} label={label} href={href} menu={megaMenus[label]} />
              ) : label === "Certificate Programs" ? (
                // Not positioned, so the panel spans the whole nav (same as MegaMenu)
                <div key={label} className="group">
                  <a href={href} aria-haspopup="true" className="nav-link inline-flex items-center gap-1 whitespace-nowrap">
                    {label}
                    <svg viewBox="0 0 12 12" className="size-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <div className="invisible absolute inset-x-0 top-full -translate-y-2 px-3 pt-2 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="mx-auto max-w-[1240px] overflow-hidden rounded-3xl border border-line/80 bg-white/90 font-sans text-foreground shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] backdrop-blur-3xl">
                      <div className="grid grid-cols-3 gap-3 p-8">
                        {certificatePrograms.map((p) => (
                          <a key={p.label} href={href} className="group/card flex items-center gap-3 rounded-2xl border border-line/70 bg-white/60 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-600/40 hover:bg-white hover:shadow-[0_10px_28px_-14px_rgba(15,23,42,0.35)]">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600/10 text-brand-600 transition-colors duration-200 group-hover/card:bg-brand-600 group-hover/card:text-white">
                              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={programIcons[p.icon]} /></svg>
                            </span>
                            <span className="min-w-0 flex-1 text-sm leading-snug font-medium text-foreground/80 transition-colors duration-200 group-hover/card:text-brand-600">{p.label}</span>
                            {p.badge && <span className="shrink-0 rounded-full bg-brand-600/10 px-2 py-0.5 text-[10px] font-semibold text-brand-600">{p.badge}</span>}
                          </a>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 bg-subtle px-8 py-4">
                        <figure className="flex min-w-0 items-center gap-3">
                          <span aria-hidden="true" className="text-3xl leading-none font-bold text-brand-600/25">&ldquo;</span>
                          <blockquote className="text-sm leading-snug text-muted italic">
                            Everybody should learn to program a computer, because it teaches you how to think.
                            <cite className="ml-1.5 font-medium text-foreground not-italic">— Steve Jobs</cite>
                          </blockquote>
                        </figure>
                        <a href="#courses" className="group/all inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                          See all courses<span className="transition-transform duration-300 group-hover/all:translate-x-1">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : label === "Branches" ? (
                <div key={label} className="group relative flex items-center self-stretch">
                  <a href={href} aria-haspopup="true" className="nav-link inline-flex items-center gap-1">
                    {label}
                    <svg viewBox="0 0 12 12" className="size-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <div className="invisible absolute top-full left-1/2 w-56 -translate-x-1/2 -translate-y-2 pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <ul className="overflow-hidden rounded-2xl border border-line/80 bg-white/90 p-2 font-sans text-foreground shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] backdrop-blur-3xl">
                      {branches.map((b) => (
                        <li key={b.city}>
                          <a href={b.href} {...(b.external ? { target: "_blank", rel: "noreferrer" } : {})} className="group/link flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground/70 transition-colors duration-200 hover:bg-subtle hover:text-brand-600">
                            <span className="h-px w-0 shrink-0 bg-brand-600 transition-all duration-300 group-hover/link:w-3" />
                            <span className="leading-snug">{b.city}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                // Reviews (also under Resources) and Why Us only fit in the bar on 2xl screens
                <a key={label} href={href} className={`nav-link ${label === "Reviews" || label === "Why Us" ? "hidden 2xl:inline" : ""}`}>{label}</a>
              ),
            )}
          </div>
          <div className="flex items-center gap-2">
            <a href="#contact" className={`hidden h-9 items-center rounded-full px-5 text-sm font-semibold transition-all duration-500 hover:bg-accent-yellow hover:text-ink hover:shadow-lg hover:shadow-accent-yellow/30 sm:inline-flex ${solid ? "bg-brand-600 text-white" : "bg-white text-ink"}`}>Book Free Demo</a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="grid size-9 place-items-center rounded-full border border-current/20 transition-colors hover:bg-current/10 xl:hidden" aria-label="Toggle menu">
              <span className={`text-lg leading-none transition-transform duration-300 ${menuOpen ? "rotate-90" : ""}`}>{menuOpen ? "×" : "☰"}</span>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="menu-in mx-auto mt-2 max-w-6xl rounded-3xl border border-line bg-white p-5 shadow-2xl shadow-black/20 xl:hidden">
            {navLinks.map(([label, href], i) =>
              label === "Courses" ? (
                <div key={label} style={delay(i, 40)} className="pop-in border-b border-line">
                  <button onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)} aria-expanded={mobileCoursesOpen} className="flex w-full items-center justify-between py-3 font-display text-lg font-semibold tracking-tight">
                    {label}<span className={`text-sm text-muted transition-transform duration-300 ${mobileCoursesOpen ? "rotate-90" : ""}`}>→</span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${mobileCoursesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-1 pb-3">
                        {categories.map(([title, , , icon]) => (
                          <a key={title} href="#categories" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-brand-50">
                            <span className="text-base">{icon}</span>{title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a key={label} href={href} onClick={() => setMenuOpen(false)} style={delay(i, 40)} className="pop-in flex items-center justify-between border-b border-line py-3 font-display text-lg font-semibold tracking-tight last:border-0">
                  {label}<span className="text-sm text-muted">→</span>
                </a>
              ),
            )}
            <div className="mt-4 flex gap-3">
              <a href={tel} className="flex h-12 flex-1 items-center justify-center rounded-full border border-foreground/20 font-medium">Call us</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="flex h-12 flex-1 items-center justify-center rounded-full bg-panel font-medium text-white">Book Demo</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="top" data-pointer className="hero-surface relative flex min-h-screen flex-col justify-center overflow-hidden pt-32 pb-32 text-white">
          <div ref={heroBgRef} className="pointer-events-none absolute inset-0 will-change-transform">
            <div className="blob blob-a -top-[30vmax] -left-[25vmax] size-[75vmax]" />
            <div className="blob blob-b top-[5%] -right-[30vmax] size-[65vmax]" />
            <div className="blob blob-c -bottom-[40vmax] left-[15%] size-[70vmax]" />
            <div className="grid-overlay absolute inset-0" />
            <div className="noise absolute inset-0" />
          </div>
          <div className="hero-spot pointer-events-none" />
          <div ref={heroRef} className="relative mx-auto grid w-full max-w-6xl origin-top items-center gap-12 px-5 will-change-transform lg:grid-cols-[1.25fr_0.75fr]">
            <div className="text-center lg:text-left">
              <span style={delay(0)} className="hero-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium">
                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-yellow opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-accent-yellow" /></span>
                GIT Education · Computer Training Institute, Jalandhar
              </span>
              <h1 className="mt-7 font-display text-[clamp(2.5rem,6vw,4.9rem)] leading-[1.02] font-extrabold tracking-[-0.03em]">
                {heroWords.map((word, i) => (
                  <Fragment key={i}>
                    <span className="word"><span style={delay(i + 2, 70)}>{word}</span></span>{" "}
                  </Fragment>
                ))}
                <span className="word">
                  <span style={delay(heroWords.length + 2, 70)}>
                    <span className="animate-float mx-1 inline-flex h-[0.8em] w-[1.5em] translate-y-[0.08em] items-center justify-center rounded-[0.3em] bg-accent-yellow text-[0.5em] shadow-lg shadow-accent-yellow/30 sm:mx-2">🖥️</span>
                  </span>
                </span>{" "}
                <span className="word">
                  <span style={delay(heroWords.length + 3, 70)} className="relative">
                    <span className="text-shine bg-gradient-to-r from-accent-yellow via-white to-accent-yellow bg-clip-text text-transparent">professional</span>
                    <Scribble onLoad className="text-brand-400" />
                  </span>
                </span>
              </h1>
              <p style={delay(6, 150)} className="hero-in mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/70 lg:mx-0 lg:text-lg">
                Basic Computer, MS Office, Advance Excel, Tally Prime with GST, Punjabi typing, CAD/CAM and graphic design, taught hands-on with one computer per student.
              </p>
              <div style={delay(7, 150)} className="hero-in mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <a href="#contact" className="group relative isolate inline-flex h-13 items-center justify-center gap-2 overflow-hidden rounded-full bg-accent-yellow px-8 font-semibold text-ink shadow-xl shadow-accent-yellow/25 transition-transform hover:-translate-y-0.5">
                  <span className="absolute inset-0 -z-10 translate-y-full rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  Book a free demo class
                </a>
                <a href="#courses" className="inline-flex h-13 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 font-medium transition-all hover:border-white/40 hover:bg-white/10">Explore courses</a>
              </div>
            </div>

            {/* Orbiting course icons */}
            <div className="relative mx-auto hidden aspect-square w-full max-w-[24rem] lg:block" aria-hidden="true">
              <div style={delay(5, 150)} className="hero-in absolute inset-0">
                <div ref={orbitRef} className="absolute inset-0 will-change-transform">
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  <div className="animate-orbit-slow absolute inset-[16%] rounded-full border border-dashed border-white/25" />
                  <div className="absolute inset-[10%] animate-pulse rounded-full bg-[radial-gradient(closest-side,rgb(61_99_245/0.55),transparent)]" />
                  <div className="animate-orbit absolute inset-0">
                    {orbitIcons.map(([icon, top, left], i) => (
                      <span key={icon} style={{ top, left }} className="absolute -translate-x-1/2 -translate-y-1/2">
                        <span className="animate-orbit-reverse block">
                          <span style={delay(i, 700)} className="animate-float grid size-16 place-items-center rounded-2xl border border-white/15 bg-[#1a2466]/80 text-3xl shadow-2xl shadow-black/30">{icon}</span>
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="animate-float absolute inset-[32%] grid place-items-center rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/20 to-white/5 text-6xl shadow-2xl shadow-black/40">🖥️</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-2">
              {[["👨‍🏫", "Expert trainers", "Patient, experienced faculty"], ["🖱️", "100% practical", "One computer per student"], ["📜", "Certified", "Certificate on completion"]].map(([icon, title, sub], i) => (
                <div key={title} style={delay(8 + i, 120)} className="hero-in group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-left transition-all hover:-translate-y-1 hover:border-white/25 hover:bg-white/10">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">{icon}</span>
                  <span><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-sm text-white/60">{sub}</span></span>
                </div>
              ))}
            </div>
          </div>
          {/* Course ticker */}
          <div className="marquee absolute -inset-x-4 bottom-8 -rotate-1 overflow-hidden bg-accent-yellow py-3 text-ink shadow-2xl shadow-black/40">
            <div ref={tickerRef} className="will-change-transform">
              {/* Four copies: the loop shifts by half, and the scroll offset needs extra length */}
              <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
                {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                  <span key={i} className="flex items-center gap-10 font-display text-sm font-bold tracking-wide uppercase">{item}<span className="text-brand-600">✦</span></span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-24 lg:py-32">
          <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-2 lg:items-center">
            <div className="reveal">
              <Pill>About Us</Pill>
              <h2 className="scroll-risemt-5 font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">
                Making <span className="relative inline-block text-brand-600">every student<Scribble className="text-accent-yellow" /></span> computer-ready for work
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted lg:text-lg">
                GIT Education is a computer training institute in Jalandhar. From your first time on a computer to professional accounting, drafting and design software, we teach the skills that offices, businesses and government jobs ask for.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <ArrowButton href="#courses">Find your course</ArrowButton>
                <a href={tel} className="text-sm font-medium transition-colors hover:text-brand-600">
                  Talk to a counsellor<span className="mt-0.5 block font-mono text-xs text-muted">{PHONE}</span>
                </a>
              </div>
            </div>
            <div style={delay(2)} className="reveal reveal-right relative">
              <div className="absolute -inset-3 rotate-3 rounded-[2.25rem] bg-gradient-to-br from-brand-600 via-violet-500 to-accent-yellow opacity-90" />
              <div className="group relative overflow-hidden rounded-[2rem] shadow-2xl shadow-brand-900/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80" alt="Students practising in a computer lab" className="scroll-parallax aspect-[4/3] w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-1" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 font-mono text-[10px] tracking-wider text-white uppercase backdrop-blur-md">GIT Education computer lab</span>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-28 max-w-6xl px-5">
            <div className="reveal">
              <span className="font-mono text-xs tracking-[0.18em] text-brand-600 uppercase">How it works</span>
              <h3 className="mt-4 max-w-2xl font-display text-3xl leading-tight font-extrabold tracking-tight text-balance lg:text-[2.6rem]">From your first class to your first job</h3>
            </div>
            <div className="relative mt-12">
              <div className="reveal line-draw absolute top-[46px] right-[12%] left-[12%] hidden h-0.5 rounded-full bg-gradient-to-r from-brand-600 via-violet-500 to-accent-yellow lg:block" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map(([phase, title, text], i) => (
                  <div key={phase} data-pointer style={delay(i, 140)} className="reveal lift spotlight rounded-3xl border border-line bg-white p-6 pt-5 hover:border-brand-200">
                    <div className="flex items-center justify-between">
                      <span className="relative z-10 grid size-12 place-items-center rounded-2xl bg-panel font-display text-lg font-bold text-white ring-8 ring-background">0{i + 1}</span>
                      <span className="rounded-full bg-brand-50 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-brand-700 uppercase">{phase}</span>
                    </div>
                    <h4 className="mt-6 font-display text-xl font-bold tracking-tight">{title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="scroll-grow relative isolate overflow-hidden rounded-t-[2.5rem] bg-panel py-24 text-white lg:py-32">
          <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
          <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <Pill dark>Our Courses</Pill>
                <h2 className="scroll-risemt-5 max-w-2xl font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Computer courses for every goal and every age</h2>
              </div>
              <ArrowButton href="#contact" variant="white">Enquire now</ArrowButton>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([title, text, gradient, icon], i) => (
                <div key={title} style={delay(i % 3, 120)} className="reveal reveal-zoom">
                  <a href="#contact" data-pointer className={`tilt spotlight spotlight-light group flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-6 ring-1 ring-white/10 ${gradient}`}>
                    <div className="grid-overlay pointer-events-none absolute inset-0 opacity-50" />
                    <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/15 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                    <span className="absolute top-5 right-5 grid size-14 place-items-center rounded-2xl border border-white/25 bg-white/15 text-3xl shadow-lg backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1 group-hover:scale-115 group-hover:-rotate-12">{icon}</span>
                    <h3 className="relative font-display text-xl font-bold tracking-tight">{title}</h3>
                    <p className="relative mt-1.5 text-sm leading-relaxed text-white/80">{text}</p>
                    <span className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold">Enquire <span className="grid size-7 place-items-center rounded-full bg-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-ink">→</span></span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured courses */}
        <section id="courses" className="relative overflow-hidden py-24 lg:py-32">
          <div className="dot-bg pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute top-0 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-5">
            <div className="reveal text-center">
              <Pill>Featured Courses</Pill>
              <h2 className="scroll-risemt-5 font-display text-4xl font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Courses that get you <span className="relative inline-block text-brand-600">hired<Scribble className="text-accent-yellow" /></span></h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted lg:text-lg">Practical training, real assignments and job support behind every course.</p>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-6">
              <article data-pointer style={delay(0)} className="reveal reveal-zoom lift spotlight glow-border rounded-[1.75rem] border border-line bg-white p-6 shadow-sm md:col-span-2">
                <h3 className="text-center font-display text-xl font-bold tracking-tight">Tally Prime with GST</h3>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["GST Returns", "TDS", "Payroll", "Inventory", "Billing", "Balance Sheet"].map((t) => <span key={t} className="rounded-full border border-line bg-subtle px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">{t}</span>)}
                </div>
                <div className="animate-float mx-auto mt-6 grid size-24 place-items-center rounded-[1.75rem] bg-gradient-to-br from-ink to-brand-600 text-4xl shadow-xl shadow-brand-900/25">🧾</div>
              </article>
              <article data-pointer style={delay(1)} className="reveal reveal-zoom lift spotlight glow-border rounded-[1.75rem] border border-line bg-white p-6 shadow-sm md:col-span-2">
                <h3 className="text-center font-display text-xl font-bold tracking-tight">Advance Excel</h3>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold text-white">Pivot</span>
                  <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold text-white">Dashboards</span>
                </div>
                <div className="mt-6 flex h-28 items-end gap-2">
                  {[["Jan", 35], ["Feb", 48], ["Mar", 42], ["Apr", 60], ["May", 72], ["Jun", 90]].map(([m, h], i) => (
                    <div key={m} className="group/bar flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <div className="bar-grow w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-accent-400 transition-[filter] group-hover/bar:brightness-110" style={{ height: `${h}%`, transitionDelay: `${400 + i * 110}ms` }} />
                      <span className="text-[10px] text-muted">{m}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article data-pointer style={delay(2)} className="reveal reveal-zoom lift spotlight spotlight-light flex flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-panel p-6 text-white md:col-span-2">
                <div className="panel-glow pointer-events-none absolute inset-0" />
                <h3 className="relative text-center font-display text-xl font-bold tracking-tight">Punjabi Typing</h3>
                <span className="text-shine relative mt-2 bg-gradient-to-r from-accent-yellow via-white to-accent-yellow bg-clip-text font-display text-6xl font-extrabold text-transparent">ਪੰਜਾਬੀ</span>
                <p className="relative mt-2 text-center text-sm leading-relaxed text-white/70">Raavi &amp; Asees fonts · timed tests for government jobs</p>
                <span className="relative mt-3 inline-flex items-center gap-1 font-mono text-xs text-accent-yellow">ਟਾਈਪ ਕਰੋ<span className="h-4 w-0.5 animate-pulse bg-accent-yellow" /></span>
              </article>
              <article data-pointer style={delay(0)} className="reveal reveal-left lift spotlight glow-border rounded-[1.75rem] border border-line bg-white p-6 shadow-sm md:col-span-3">
                <h3 className="text-center font-display text-xl font-bold tracking-tight">CAD / CAM</h3>
                <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-muted">AutoCAD, SolidWorks, CATIA, Creo and Revit for mechanical, civil and architecture students, with 2D drafting, 3D modelling and project drawings.</p>
                <div className="mt-6 flex items-center justify-center gap-8">
                  <div className="grid size-24 place-items-center rounded-full border-2 border-dashed border-brand-300 bg-brand-50 text-4xl"><span className="animate-[spin_12s_linear_infinite]">📐</span></div>
                  <ul className="space-y-2 text-sm">
                    {[["AutoCAD", "2D + 3D"], ["SolidWorks", "3D"], ["Revit", "BIM"]].map(([t, v]) => (
                      <li key={t} className="flex items-center justify-between gap-4 transition-transform duration-300 hover:translate-x-1">{t}<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{v}</span></li>
                    ))}
                  </ul>
                </div>
              </article>
              <article data-pointer style={delay(1)} className="reveal reveal-right lift spotlight glow-border rounded-[1.75rem] border border-line bg-white p-6 shadow-sm md:col-span-3">
                <h3 className="text-center font-display text-xl font-bold tracking-tight">Graphic Design</h3>
                <div className="mx-auto mt-6 max-w-sm space-y-3">
                  {[["🖼️", "Photoshop", "Photo editing & social media posts"], ["✒️", "CorelDRAW & Illustrator", "Logos, banners & visiting cards"], ["📰", "InDesign & PageMaker", "Magazines, brochures & DTP"]].map(([icon, title, sub]) => (
                    <div key={title} className="group/row flex items-center gap-3 rounded-2xl border border-line bg-subtle px-4 py-3 transition-all duration-300 hover:translate-x-1 hover:border-brand-200 hover:bg-brand-50">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm transition-transform duration-300 group-hover/row:scale-110 group-hover/row:-rotate-6">{icon}</span>
                      <span className="min-w-0"><span className="block truncate text-sm font-semibold">{title}</span><span className="block text-xs text-muted">{sub}</span></span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="reveal reveal-zoom text-shine flex flex-col items-center justify-between gap-4 rounded-[1.75rem] bg-gradient-to-r from-panel via-brand-600 to-panel p-7 text-white shadow-xl shadow-brand-900/20 md:col-span-6 md:flex-row">
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight">Basic Computer + MS Office</h3>
                  <p className="mt-1 text-sm text-white/80">The perfect first course: Windows, internet, Word, Excel, PowerPoint and typing basics.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Windows", "Internet", "Word", "Excel", "PowerPoint"].map((t, i) => <span key={t} style={delay(i, 80)} className="animate-float rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">{t}</span>)}
                </div>
              </article>
            </div>
            <div className="mt-12 flex justify-center"><ArrowButton href="#contact">Ask about fees &amp; batches</ArrowButton></div>
          </div>
        </section>

        {/* Difference */}
        <section id="difference" className="border-t border-line bg-subtle py-24 lg:py-32">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.3fr]">
            <div className="reveal lg:sticky lg:top-28 lg:self-start">
              <h2 className="scroll-risefont-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]"><span className="text-brand-600">/</span> The GIT Education Difference</h2>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted">
                Students and parents in Jalandhar choose us for patient teaching, a well-equipped computer lab and courses that lead to real jobs.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                <a href={tel} className="group inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">Call Now <span className="transition-transform group-hover:translate-x-1">→</span></a>
                <a href="#contact" className="group inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">Book a Free Demo <span className="transition-transform group-hover:translate-x-1">→</span></a>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {differences.map(([title, text], i) => (
                <div key={title} data-pointer style={delay(i, 120)} className={`reveal lift spotlight group rounded-3xl border border-line bg-white p-7 hover:border-brand-200 ${i % 2 === 1 ? "sm:mt-10" : ""}`}>
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-500 text-xl text-white shadow-lg shadow-brand-600/25 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-12">{["📚", "🎓", "🤝", "🗓️"][i]}</span>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="relative overflow-hidden bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h2 className="scroll-risemax-w-xl font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">What our students say about GIT Education</h2>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3.5 py-1.5"><span className="text-amber-500">★</span> <Counter to={4.9} decimals={1} />/5 Rating</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3.5 py-1.5">💬 <Counter to={500} suffix="+" /> Reviews</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3.5 py-1.5">🎓 <Counter to={10} suffix="K+" /> Students trained</span>
                </div>
              </div>
              <ArrowButton href="#contact" variant="panel">Get started today</ArrowButton>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map(([initials, name, role, text, gradient], i) => (
                <figure key={name} data-pointer style={delay(i % 3, 120)} className={`reveal lift spotlight flex flex-col overflow-hidden rounded-3xl border border-line bg-background p-7 hover:border-brand-200 hover:bg-white ${i % 3 === 1 ? "lg:mt-10" : ""}`}>
                  <span aria-hidden="true" className="pointer-events-none absolute -right-2 -bottom-10 font-display text-[9rem] leading-none text-brand-100">&rdquo;</span>
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm tracking-widest text-amber-500">★★★★★</span>
                    <span className="rounded-full bg-subtle px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted">Google</span>
                  </div>
                  <blockquote className="relative mt-5 flex-1 text-[0.95rem] leading-relaxed">&ldquo;{text}&rdquo;</blockquote>
                  <figcaption className="relative mt-7 flex items-center gap-3">
                    <span className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white ring-4 ring-white ${gradient}`}>{initials}</span>
                    <span className="min-w-0"><span className="block text-sm font-semibold">{name}</span><span className="block truncate text-xs text-muted">{role}</span></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="scroll-grow relative isolate overflow-clip rounded-[2.5rem] bg-panel py-24 text-white lg:py-32">
          <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
          <div className="noise pointer-events-none absolute inset-0 -z-10" />
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.4fr]">
            <div className="reveal lg:sticky lg:top-28 lg:self-start">
              <Pill dark>Included</Pill>
              <h2 className="scroll-risemt-5 font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Included with every course we run</h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-white/65">Whichever course and batch you choose, all of this comes as standard.</p>
            </div>
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {modules.map(([title, text], i) => (
                <li key={title} style={delay(i, 90)} className="reveal reveal-right group relative isolate py-7 pl-16 before:absolute before:inset-y-2 before:-inset-x-4 before:-z-10 before:origin-left before:scale-x-0 before:rounded-2xl before:bg-white/[0.06] before:transition-transform before:duration-500 hover:before:scale-x-100">
                  <span className="absolute top-7 left-0 grid size-11 place-items-center rounded-full border border-white/20 font-mono text-xs text-white/60 transition-all duration-300 group-hover:border-accent-yellow group-hover:bg-accent-yellow group-hover:text-ink">0{i + 1}</span>
                  <h3 className="font-display text-xl font-bold tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 lg:text-2xl">{title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 lg:text-base">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Software */}
        <section id="software" className="py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-5 text-center">
            <div className="reveal">
              <Pill>Software</Pill>
              <h2 className="scroll-risemt-5 font-display text-4xl font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Software We Teach</h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted lg:text-lg">From everyday office tools to professional accounting, drafting and design software.</p>
            </div>
            <div style={delay(2)} className="reveal mt-10 flex overflow-x-auto pb-2 sm:justify-center">
              <div className="inline-flex gap-1 rounded-full border border-line bg-white p-1.5 shadow-sm">
                {Object.keys(softwareTabs).map((tab) => (
                  <button key={tab} onClick={() => setSoftwareTab(tab)} className={`rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ${softwareTab === tab ? "bg-panel text-white shadow-lg shadow-panel/25" : "text-muted hover:bg-subtle hover:text-foreground"}`}>{tab}</button>
                ))}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {softwareTabs[softwareTab].map((item, i) => (
                <div key={`${softwareTab}-${item}`} data-pointer style={delay(i, 55)} className="pop-in spotlight group flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-4 text-left transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/10">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 font-display text-sm font-bold text-brand-700 transition-all duration-300 group-hover:rotate-[-8deg] group-hover:bg-gradient-to-br group-hover:from-brand-600 group-hover:to-violet-500 group-hover:text-white">{item[0]}</span>
                  <span className="truncate text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center"><ArrowButton href="#contact">Enquire about a course</ArrowButton></div>
          </div>
        </section>

        {/* Careers */}
        <section className="scroll-grow relative isolate overflow-hidden rounded-t-[2.5rem] bg-panel py-24 text-white lg:py-32">
          <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
          <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal">
              <Pill dark>Career Paths</Pill>
              <h2 className="scroll-risemt-5 max-w-3xl font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Pick a career, and we&apos;ll show you the courses for it</h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
              <div className="reveal reveal-left flex flex-col gap-1">
                {careers.map(([title], i) => (
                  <button key={title} onClick={() => setCareer(i)} className={`group relative flex items-center justify-between overflow-hidden rounded-2xl px-6 py-4 text-left font-medium transition-all duration-300 ${career === i ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                    <span className={`absolute top-1/2 left-0 w-1 -translate-y-1/2 rounded-full bg-accent-yellow transition-all duration-500 ${career === i ? "h-8 opacity-100" : "h-0 opacity-0"}`} />
                    <span className={`transition-transform duration-300 ${career === i ? "translate-x-1" : "group-hover:translate-x-1"}`}>{title}</span>
                    <span className="text-accent-yellow">{career === i ? "→" : ""}</span>
                  </button>
                ))}
              </div>
              <div data-pointer style={delay(2)} className="reveal reveal-right spotlight spotlight-light rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur lg:p-8">
                <div key={career} className="relative">
                  <h3 className="hero-in font-display text-3xl font-bold tracking-tight">{careers[career][0]}</h3>
                  <p style={delay(1)} className="hero-in mt-3 mb-7 max-w-2xl text-sm leading-relaxed text-white/70">{careers[career][1]}</p>
                  <p className="mb-3 font-mono text-xs tracking-[0.16em] text-white/50 uppercase">Recommended courses</p>
                  <div className="grid grid-cols-2 gap-3">
                    {careers[career][2].map((c, i) => (
                      <span key={c} style={delay(i + 2, 80)} className="pop-in rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-foreground shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="relative mt-8"><a href="#contact" className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-2 pr-2 pl-7 text-sm font-semibold transition-colors hover:bg-white/15">Get career advice<span className="grid size-9 place-items-center rounded-full bg-accent-yellow text-ink transition-transform duration-500 group-hover:-rotate-45">→</span></a></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-5">
            <div className="reveal text-center">
              <h2 className="scroll-risefont-display text-4xl font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Frequently asked questions</h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted lg:text-lg">Quick answers about our courses, batches, fees and certificates.</p>
            </div>
            <div className="mt-12 space-y-3">
              {faqs.map(([q, a], i) => {
                const open = openFaq === i;
                return (
                  <div key={q} style={delay(i, 70)} className="reveal">
                  <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${open ? "border-brand-200 bg-white shadow-xl shadow-brand-900/5" : "border-line bg-white/60 hover:border-brand-200 hover:bg-white"}`}>
                    <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open} className="flex w-full items-center gap-4 px-6 py-5 text-left lg:px-7">
                      <span className={`flex-1 text-base font-semibold tracking-tight transition-colors lg:text-[1.0625rem] ${open ? "text-brand-700" : ""}`}>{q}</span>
                      <span className={`grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${open ? "rotate-[135deg] bg-panel text-white" : "bg-subtle text-muted"}`}>+</span>
                    </button>
                    {/* Smooth height animation via grid-template-rows */}
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <div className={`px-6 pb-6 text-sm leading-relaxed text-muted transition-all duration-500 lg:px-7 ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>{a}</div>
                      </div>
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="relative overflow-hidden border-t border-line bg-subtle">
        <div className="mx-auto max-w-6xl px-5">
          <div className="reveal reveal-zoom relative isolate mt-12 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-panel p-8 text-white shadow-2xl shadow-brand-900/20 lg:flex-row lg:items-center lg:p-10">
            <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
            <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-60" />
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">Ready to start learning?</h3>
              <p className="mt-1.5 text-sm text-white/65">Book a free demo class and see our computer lab before you decide.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${EMAIL}?subject=Free%20demo%20class`} className="inline-flex h-11 items-center gap-2 rounded-full bg-accent-yellow px-6 text-sm font-semibold text-ink shadow-lg shadow-accent-yellow/20 transition-all hover:-translate-y-0.5 hover:bg-white">Book Free Demo →</a>
              <a href={tel} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium transition-colors hover:border-white/50 hover:bg-white/10">📞 {PHONE}</a>
            </div>
          </div>
          <div className="relative z-10 grid gap-12 pt-16 pb-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="#top" className="group flex items-center gap-2 font-display text-xl font-bold tracking-tight">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-sm font-extrabold text-white transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">GIT</span>
                GIT <span className="-ml-1 text-brand-600">Education</span>
              </a>
              <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted">Computer Training Institute</p>
              <ul className="mt-7 space-y-3.5 text-sm text-muted">
                <li className="flex gap-3">
                  <svg viewBox="0 0 24 24" className="mt-0.5 size-[18px] shrink-0 fill-brand-600" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
                  Jalandhar, Punjab, India
                </li>
                <li>
                  <a href={tel} className="flex gap-3 transition-colors hover:text-brand-600">
                    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0 fill-brand-600" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" /></svg>
                    {PHONE}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`} className="flex gap-3 transition-colors hover:text-brand-600">
                    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0 fill-brand-600" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" /></svg>
                    {EMAIL}
                  </a>
                </li>
                <li className="flex gap-3">
                  <svg viewBox="0 0 24 24" className="size-[18px] shrink-0 fill-none stroke-brand-600" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>
                  Mon – Sat, 8 AM – 7 PM
                </li>
              </ul>
              <div className="mt-8 flex gap-3">
                {[
                  ["Instagram", <svg key="i" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" /></svg>],
                  ["YouTube", <svg key="y" viewBox="0 0 24 24" className="size-5 fill-current"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3-5.8 3z" /></svg>],
                  ["LinkedIn", <svg key="l" viewBox="0 0 24 24" className="size-5 fill-current"><path d="M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6c0-.9-.7-1.6-1.6-1.6zM8 19H5V9.5h3V19zM6.5 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.8 13 12.8 14.3V19h-3V9.5h2.8v1.3h.1c.4-.7 1.4-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5V19z" /></svg>],
                ].map(([label, icon]) => (
                  <a key={label as string} href="#top" aria-label={label as string} className="grid size-12 place-items-center rounded-full bg-line/70 text-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 hover:text-white hover:shadow-lg hover:shadow-brand-600/25">{icon}</a>
                ))}
              </div>
            </div>
            {footerCols.map(([heading, links]) => (
              <div key={heading}>
                <p className="sr-only">{heading}</p>
                <ul className="space-y-4">
                  {links.map((l) => <li key={l}><a href="#courses" className="inline-block text-[1.05rem] text-muted transition-all duration-200 hover:translate-x-1 hover:text-brand-600">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Giant background wordmark */}
        <svg aria-hidden="true" viewBox="0 0 1000 190" className="wordmark-rise pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full select-none">
          <defs>
            <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--color-brand-600)" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <text x="16" y="176" textLength="918" lengthAdjust="spacingAndGlyphs" fill="url(#footer-wordmark)" style={{ fontFamily: "var(--font-inter), ui-sans-serif, sans-serif", fontSize: 200, fontWeight: 700 }}>techcadd</text>
          <text x="926" y="176" fill="url(#footer-wordmark)" style={{ fontFamily: "var(--font-inter), ui-sans-serif, sans-serif", fontSize: 200, fontWeight: 700 }}>.</text>
        </svg>

        <div className="relative z-10 mx-auto max-w-6xl px-5">
          <nav className="flex flex-wrap gap-x-9 gap-y-2 border-t border-foreground/10 py-6 text-sm text-muted">
            {["Privacy Policy", "Terms & Conditions", "Refund Policy"].map((l) => <a key={l} href="#top" className="transition-colors hover:text-brand-600">{l}</a>)}
          </nav>
          <div className="flex flex-col gap-3 border-t border-foreground/10 py-7 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
            <p>© {new Date().getFullYear()} GIT Education. All rights reserved. Built in <span className="font-medium text-foreground">Jalandhar, Punjab</span>.</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-emerald-500" /></span>Admissions Open</span>
              <span className="h-4 w-px bg-foreground/15" />
              <span>4.9★ on Google (500+ reviews)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <a href="#top" aria-label="Back to top" className={`fixed right-6 bottom-24 z-40 grid size-11 place-items-center rounded-full border border-white/10 bg-panel text-white shadow-xl shadow-black/25 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:bg-brand-600 ${showTop ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-75 opacity-0"}`}>↑</a>

      {/* WhatsApp */}
      <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="animate-pulse-ring fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl shadow-black/20 transition-transform hover:scale-110 hover:-rotate-12">
        <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.2-.6-.4zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6zm0-21.6A11.8 11.8 0 0 0 1.8 17.9L.1 24l6.3-1.6A11.8 11.8 0 1 0 12 .2z" /></svg>
      </a>
    </>
  );
}
