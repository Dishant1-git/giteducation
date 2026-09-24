"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/icon";
import { SITE, TEL_HREF } from "@/lib/site";

const steps = [
  ["Day 1", "Counselling", "Tell us your goal (job, business or exam) and we'll suggest the right course and batch timing."],
  ["Classes", "Daily practicals", "Small batches with one computer per student and a trainer to help you in every class."],
  ["Practice", "Real assignments", "Work on real office files, GST invoices, drawings and designs, not just theory."],
  ["Completion", "Certificate & jobs", "Take the final test, get your certificate and get help with your CV and job interviews."],
];

// [title, blurb, gradient, icon, course slug]
const categories = [
  ["Artificial Intelligence", "Python, machine learning and generative AI with four live projects.", "from-violet-600 to-brand-500", "🤖", "artificial-intelligence-course-in-jalandhar"],
  ["Basic Computer", "Windows, internet, email, typing basics and everyday computer use.", "from-brand-600 to-accent-500", "💻", "basic-computer-course-in-jalandhar"],
  ["MS Office", "Word, Excel, PowerPoint and Outlook for office and school work.", "from-brand-700 to-brand-500", "📄", "ms-office-course-in-jalandhar"],
  ["Advance Excel", "Formulas, VLOOKUP/XLOOKUP, pivot tables, dashboards and macros.", "from-emerald-600 to-accent-500", "📊", "advance-excel-course-in-jalandhar"],
  ["Tally Prime with GST", "Accounting, inventory, GST, TDS and payroll with Tally Prime.", "from-ink to-brand-700", "🧾", "tally-prime-course-in-jalandhar"],
  ["Punjabi Typing", "Gurmukhi typing in Raavi and Asees fonts for government job tests.", "from-brand-500 to-accent-glow", "⌨️", "punjabi-typing-course-in-jalandhar"],
  ["CAD / CAM", "AutoCAD, SolidWorks, CATIA, Creo and Revit for engineers and architects.", "from-logo to-brand-600", "📐", "cad-cam-course-in-jalandhar"],
  ["Graphic Design", "Photoshop, CorelDRAW, Illustrator and InDesign for print and social media.", "from-violet-600 to-brand-500", "🎨", "graphic-design-course-in-jalandhar"],
  ["English Typing", "Build speed and accuracy for clerk, steno and data-entry exams.", "from-accent-500 to-brand-700", "🔤", "english-typing-course-in-jalandhar"],
  ["DTP & Printing", "Page layout, visiting cards, flex banners and wedding cards.", "from-brand-700 to-violet-500", "🖨️", "dtp-printing-course-in-jalandhar"],
  ["Digital Marketing", "SEO, Google Ads, Meta Ads and analytics run on a real business.", "from-brand-700 to-violet-500", "📣", "digital-marketing-course-in-jalandhar"],
];

// Category panels. `pos` picks which part of the photo the narrow panel shows.
const categoryPanels = [
  { title: "Computer & MS Office", blurb: "Windows, internet, Word, Excel and email basics", image: "/images/categories/office.jpg", href: "/courses/basic-computer-course-in-jalandhar", pos: "object-[72%_50%]" },
  { title: "Accounting & Tally", blurb: "Tally Prime, GST returns, billing and payroll entries", image: "/images/categories/accounts.jpg", href: "/courses/tally-prime-course-in-jalandhar", pos: "object-[38%_50%]" },
  { title: "Web Development", blurb: "Web designing, WordPress and development with Python", image: "/images/categories/web.jpg", href: "/courses", pos: "object-center" },
  { title: "CAD / CAM", blurb: "AutoCAD, SolidWorks and Revit drawings for engineers", image: "/images/categories/cad.jpg", href: "/courses/cad-cam-course-in-jalandhar", pos: "object-[28%_50%]" },
  { title: "Graphic Design", blurb: "Photoshop, CorelDRAW and Illustrator for print work", image: "/images/categories/design.jpg", href: "/courses/graphic-design-course-in-jalandhar", pos: "object-[45%_60%]" },
  { title: "Digital Marketing", blurb: "SEO, Google Ads and Meta Ads for businesses", image: "/images/categories/digital.jpg", href: "/courses/digital-marketing-course-in-jalandhar", pos: "object-[35%_50%]" },
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
  const [softwareTab, setSoftwareTab] = useState("Basic & Office");
  const [career, setCareer] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Scroll-linked hero layers. Transform and opacity only, so each layer moves on
  // the compositor without repainting. Site-wide scrolling, the progress bar and
  // the reveal system live in <SiteChrome>.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    let lastY = window.scrollY;
    let velocity = 0;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      velocity = y - lastY;
      lastY = y;
      if (y > vh * 1.2) return;
      const p = Math.min(y / vh, 1);
      if (heroRef.current) {
        heroRef.current.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(${1 - p * 0.06})`;
        heroRef.current.style.opacity = `${Math.max(0, 1 - p * 1.15)}`;
      }
      if (heroBgRef.current) heroBgRef.current.style.transform = `translate3d(0, ${y * 0.5}px, 0) scale(${1 + p * 0.2})`;
      if (orbitRef.current) orbitRef.current.style.transform = `rotate(${p * 70}deg) scale(${1 + p * 0.12})`;
      if (tickerRef.current) {
        // Ticker slides with the scroll and leans with scroll speed
        const skew = Math.max(-10, Math.min(10, velocity * -0.35));
        tickerRef.current.style.transform = `translate3d(${-y * 0.3}px, 0, 0) skewX(${skew}deg)`;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
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
        {/* overflow-x-clip: the tilted frame behind the photo would otherwise widen the page on phones */}
        <section id="about" className="overflow-x-clip py-24 lg:py-32">
          <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
            {/* Two overlapping photos with a dotted panel behind and a floating stat */}
            <div style={delay(1)} className="reveal reveal-left relative pb-14 lg:pb-0">
              <div className="dot-pattern pointer-events-none absolute -top-6 -left-6 hidden size-40 text-brand-300 sm:block" />
              <div className="pointer-events-none absolute top-8 -right-2 hidden h-40 w-24 rounded-r-3xl border-y-2 border-r-2 border-brand-200 lg:block" />
              <div className="relative grid grid-cols-2 gap-4 sm:gap-5">
                <div className="group relative mt-10 self-start overflow-hidden rounded-[1.5rem] shadow-xl shadow-brand-900/15 sm:mt-14">
                  <Image
                    src="/images/about/alpine-college-team-with-faculty.jpeg"
                    alt="GIT Education trainers with students at a college session"
                    width={1280}
                    height={960}
                    sizes="(min-width: 1024px) 560px, 90vw"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                </div>
                <div className="group relative self-start overflow-hidden rounded-[1.5rem] shadow-xl shadow-brand-900/15">
                  <Image
                    src="/images/about/alpine-college-full-hall.jpeg"
                    alt="Students in a full GIT Education training hall"
                    width={1600}
                    height={1200}
                    sizes="(min-width: 1024px) 560px, 90vw"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="animate-float absolute bottom-0 left-0 flex items-center gap-3 rounded-2xl bg-action px-5 py-4 text-white shadow-2xl shadow-brand-900/30 lg:bottom-6 lg:-left-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15">
                  <Icon name="users" className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-xl leading-none font-bold">
                    <Counter to={10} suffix="K+" />
                  </span>
                  <span className="mt-1 block text-xs text-white/75">Students trained</span>
                </span>
              </div>
            </div>

            <div className="reveal">
              <Pill>Our About Us</Pill>
              <h2 className="scroll-rise mt-5 font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.2rem]">
                Training <span className="relative inline-block text-brand-600">every student<Scribble className="text-accent-yellow" /></span> in Jalandhar since {SITE.established}.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
                GIT Education is a computer training institute in Jalandhar. From your first time on a computer to professional accounting, drafting and design software, we teach the skills that offices, businesses and government jobs ask for.
              </p>

              <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {["One computer per student", "Daily practical assignments", "Morning, evening & weekend batches", "Certificate and placement help"].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm font-medium">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-action/10 text-action">
                      <Icon name="check" className="size-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-full border-4 border-action/15 font-display text-lg font-bold text-action">4.9★</span>
                <span className="text-sm leading-relaxed">
                  <span className="block font-semibold">Rated 4.9 on Google</span>
                  <span className="block text-muted">by more than 500 students and parents</span>
                </span>
              </div>

              <figure className="mt-5 rounded-2xl border border-line bg-subtle p-6">
                <span aria-hidden="true" className="font-display text-4xl leading-none font-bold text-action/25">&ldquo;</span>
                <blockquote className="mt-1 text-sm leading-relaxed italic">
                  Nobody leaves a class stuck. Trainers sit with each student until the work feels easy, and the lab stays open for extra practice.
                </blockquote>
                <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold tracking-wide text-muted uppercase">{SITE.name}, {SITE.address.locality}</span>
                  <a href={TEL_HREF} className="group inline-flex items-center gap-2 text-sm font-semibold text-action">
                    Talk to a counsellor
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </figcaption>
              </figure>

              <div className="mt-8">
                <ArrowButton href="#courses">Find your course</ArrowButton>
              </div>
            </div>
          </div>

          {/* Figures */}
          <div className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-4 px-5 lg:grid-cols-4">
            {([
              ["users", 10, "K+", "Students trained"],
              ["book", 30, "+", "Courses & software"],
              ["calendar", 10, "", "Years of teaching"],
              ["certificate", 500, "+", "Google reviews"],
            ] as const).map(([icon, to, suffix, label], i) => (
              <div key={label} data-pointer style={delay(i, 110)} className="reveal lift spotlight flex items-center gap-4 rounded-3xl border border-line bg-white p-5 hover:border-brand-200">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-action/10 text-action">
                  <Icon name={icon} className="size-6" />
                </span>
                <span>
                  <span className="block font-display text-2xl leading-none font-bold">
                    <Counter to={to} suffix={suffix} />
                  </span>
                  <span className="mt-1.5 block text-xs text-muted">{label}</span>
                </span>
              </div>
            ))}
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
                <h2 className="scroll-rise mt-5 max-w-2xl font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Computer courses for every goal and every age</h2>
              </div>
              <ArrowButton href="#contact" variant="white">Enquire now</ArrowButton>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([title, text, gradient, icon, slug], i) => (
                <div key={title} style={delay(i % 3, 120)} className="reveal reveal-zoom">
                  <Link href={`/courses/${slug}`} data-pointer className={`tilt spotlight spotlight-light group flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-6 ring-1 ring-white/10 ${gradient}`}>
                    <div className="grid-overlay pointer-events-none absolute inset-0 opacity-50" />
                    <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/15 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                    <span className="absolute top-5 right-5 grid size-14 place-items-center rounded-2xl border border-white/25 bg-white/15 text-3xl shadow-lg backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1 group-hover:scale-115 group-hover:-rotate-12">{icon}</span>
                    <h3 className="relative font-display text-xl font-bold tracking-tight">{title}</h3>
                    <p className="relative mt-1.5 text-sm leading-relaxed text-white/80">{text}</p>
                    <span className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold">View course <span className="grid size-7 place-items-center rounded-full bg-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-ink">→</span></span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category panels: picture only until hovered, then the panel widens to reveal the name */}
        <section id="fields" className="py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal text-center">
              <Pill>Explore by field</Pill>
              <h2 className="scroll-rise mt-5 font-display text-4xl font-extrabold tracking-[-0.02em] lg:text-[3.2rem]">Pick the work you want to do</h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">Hover a picture to see what that field covers.</p>
            </div>

            {/* Desktop: panels share the row and the hovered one grows sideways */}
            <div style={delay(2)} className="reveal mt-14 hidden h-[28rem] gap-3 md:flex lg:h-[30rem]">
              {categoryPanels.map(({ title, blurb, image, href, pos }) => (
                <Link
                  key={title}
                  href={href}
                  aria-label={`${title}: ${blurb}`}
                  className="group relative flex-[1] overflow-hidden rounded-[1.75rem] ring-1 ring-foreground/10 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:flex-[4] focus-visible:flex-[4] focus-visible:outline-none"
                >
                  {/* Fixed-width image: the panel crops more or less of it, the picture itself never scales */}
                  <Image
                    src={image}
                    alt=""
                    width={1400}
                    height={933}
                    sizes="560px"
                    className={`absolute inset-y-0 left-1/2 h-full w-[34rem] max-w-none -translate-x-1/2 object-cover ${pos}`}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-panel via-panel/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 translate-y-3 p-7 text-white opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <span className="block font-display text-2xl font-bold tracking-tight whitespace-nowrap">{title}</span>
                    <span className="mt-2 block text-[13px] text-white/75 whitespace-nowrap">{blurb}</span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Phones: no hover, so each card shows its picture and text together */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 md:hidden">
              {categoryPanels.map(({ title, blurb, image, href }, i) => (
                <Link key={title} href={href} style={delay(i, 100)} className="reveal group relative block h-56 overflow-hidden rounded-[1.5rem] ring-1 ring-foreground/10">
                  <Image src={image} alt="" width={1400} height={933} sizes="(min-width: 640px) 45vw, 90vw" className="absolute inset-0 size-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-panel via-panel/40 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="block font-display text-xl font-bold tracking-tight">{title}</span>
                    <span className="mt-1 block text-sm text-white/75">{blurb}</span>
                  </span>
                </Link>
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
              <h2 className="scroll-rise mt-5 font-display text-4xl font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Courses that get you <span className="relative inline-block text-brand-600">hired<Scribble className="text-accent-yellow" /></span></h2>
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
                <h3 className="relative text-center font-display text-xl font-bold tracking-tight">Web Development</h3>
                <span className="text-shine relative mt-2 bg-gradient-to-r from-accent-yellow via-white to-accent-yellow bg-clip-text font-display text-6xl font-extrabold text-transparent">&lt;/&gt;</span>
                <p className="relative mt-2 text-center text-sm leading-relaxed text-white/70">Web designing, WordPress &amp; development with Python</p>
                <span className="relative mt-3 inline-flex items-center gap-1 font-mono text-xs text-accent-yellow">npm run dev<span className="h-4 w-0.5 animate-pulse bg-accent-yellow" /></span>
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
                <a href={TEL_HREF} className="group inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">Call Now <span className="transition-transform group-hover:translate-x-1">→</span></a>
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
              <h2 className="scroll-rise mt-5 font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Included with every course we run</h2>
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
              <h2 className="scroll-rise mt-5 font-display text-4xl font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Software We Teach</h2>
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
              <h2 className="scroll-rise mt-5 max-w-3xl font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] lg:text-[3.4rem]">Pick a career, and we&apos;ll show you the courses for it</h2>
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

    </>
  );
}
