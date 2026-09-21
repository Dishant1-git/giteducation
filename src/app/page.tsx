"use client";

import { useEffect, useRef, useState } from "react";

const PHONE = "+91 00000 00000";
const EMAIL = "info@giteducation.org";

const navLinks = [
  ["Home", "#top"],
  ["About", "#about"],
  ["Courses", "#courses"],
  ["Software", "#software"],
  ["Why Us", "#difference"],
  ["Reviews", "#reviews"],
  ["Contact", "#contact"],
];

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

// Stagger delay for .reveal / .hero-in elements
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
    <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide ${dark ? "border-white/25 bg-white/10 text-white" : "border-line bg-subtle text-foreground"}`}>
      {children}
    </span>
  );
}

function ArrowButton({ href, children, variant = "brand" }: { href: string; children: React.ReactNode; variant?: "brand" | "white" | "panel" }) {
  const styles = {
    brand: "bg-brand-600 text-white hover:bg-brand-700",
    white: "bg-white text-ink hover:bg-brand-50",
    panel: "bg-panel text-white hover:bg-logo",
  }[variant];
  const circle = variant === "white" ? "bg-brand-600 text-white" : "bg-white text-brand-700";
  return (
    <a href={href} className={`group inline-flex shrink-0 items-center gap-3 self-start rounded-full py-2 pr-2 pl-7 text-sm font-semibold transition-colors ${styles}`}>
      {children}
      <span className={`grid size-9 place-items-center rounded-full transition-transform group-hover:translate-x-0.5 ${circle}`}>→</span>
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

  // Header state, scroll progress bar and hero parallax
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setShowTop(y > 800);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (heroRef.current && !reduceMotion && y < window.innerHeight) {
        heroRef.current.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
        heroRef.current.style.opacity = `${1 - y / (window.innerHeight * 0.9)}`;
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

  const solid = scrolled || menuOpen;
  const tel = `tel:${PHONE.replace(/\s/g, "")}`;

  return (
    <>
      <div ref={progressRef} style={{ transform: "scaleX(0)" }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-brand-600 via-accent-glow to-accent-yellow" />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
        <nav className={`mx-auto flex max-w-[1304px] items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 lg:px-6 ${solid ? "border-line bg-white/90 text-foreground shadow-lg shadow-panel/5 backdrop-blur-md" : "border-transparent bg-transparent text-white"}`}>
          <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-sm font-extrabold text-white">GIT</span>
            <span>GIT <span className="text-brand-500">Education</span></span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {navLinks.slice(0, 2).map(([label, href]) => <a key={label} href={href} className="opacity-85 transition-opacity hover:opacity-100">{label}</a>)}
            <a href="#categories" className="rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 px-3.5 py-1 text-white">New Batches</a>
            {navLinks.slice(2).map(([label, href]) =>
              label === "Courses" ? (
                <div key={label} className="group relative">
                  <a href={href} aria-haspopup="true" className="inline-flex items-center gap-1 opacity-85 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    {label}
                    <svg viewBox="0 0 12 12" className="size-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  {/* pt-4 bridges the gap so the menu stays open while the pointer moves down */}
                  <div className="invisible absolute top-full left-1/2 w-[34rem] -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="rounded-3xl border border-line bg-white p-3 text-foreground shadow-2xl shadow-panel/10">
                      <div className="grid grid-cols-2 gap-1">
                        {categories.map(([title, , , icon]) => (
                          <a key={title} href="#categories" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-brand-50 focus:bg-brand-50 focus:outline-none">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-subtle text-lg">{icon}</span>
                            <span className="text-sm font-medium">{title}</span>
                          </a>
                        ))}
                      </div>
                      <a href={href} className="mt-2 flex items-center justify-between rounded-2xl bg-panel px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-logo">
                        View featured courses<span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <a key={label} href={href} className="opacity-85 transition-opacity hover:opacity-100">{label}</a>
              ),
            )}
          </div>
          <div className="flex items-center gap-2">
            <a href="#contact" className="hidden h-9 items-center rounded-full bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700 sm:inline-flex">Book Free Demo</a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="grid size-9 place-items-center rounded-full border border-current/20 lg:hidden" aria-label="Toggle menu">
              <span className="text-lg leading-none">{menuOpen ? "×" : "☰"}</span>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-[1304px] rounded-3xl border border-line bg-white p-5 shadow-xl lg:hidden">
            {navLinks.map(([label, href]) =>
              label === "Courses" ? (
                <div key={label} className="border-b border-line">
                  <button onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)} aria-expanded={mobileCoursesOpen} className="flex w-full items-center justify-between py-3 font-display text-lg tracking-tight">
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
                <a key={label} href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-line py-3 font-display text-lg tracking-tight last:border-0">
                  {label}<span className="text-sm text-muted">→</span>
                </a>
              ),
            )}
            <div className="mt-4 flex gap-3">
              <a href={tel} className="flex h-12 flex-1 items-center justify-center rounded-full border border-foreground/20 font-medium">Call us</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="flex h-12 flex-1 items-center justify-center rounded-full bg-logo font-medium text-white">Book Demo</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="top" className="hero-surface relative flex min-h-screen flex-col justify-center overflow-hidden pt-28 pb-20 text-white">
          <div className="grid-overlay pointer-events-none absolute inset-0" />
          {/* Floating background shapes */}
          <div className="animate-drift pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="animate-drift pointer-events-none absolute right-[-6rem] bottom-10 size-[28rem] rounded-full bg-accent-glow/20 blur-3xl [animation-delay:-7s]" />
          <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
            {[["📊", "top-[22%] left-[7%]", 0], ["⌨️", "top-[62%] left-[10%]", 1200], ["📐", "top-[25%] right-[8%]", 600], ["🎨", "top-[64%] right-[11%]", 1800]].map(([icon, pos, d]) => (
              <span key={icon as string} style={delay(d as number, 1)} className={`animate-float absolute grid size-16 place-items-center rounded-2xl border border-white/15 bg-white/10 text-3xl shadow-2xl backdrop-blur-md ${pos}`}>{icon}</span>
            ))}
          </div>
          <div ref={heroRef} className="relative mx-auto w-full max-w-6xl px-5 text-center will-change-transform">
            <span style={delay(0)} className="hero-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-glow opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-accent-glow" /></span>
              GIT Education · Computer Training Institute, Jalandhar
            </span>
            <h1 style={delay(1, 150)} className="hero-in mx-auto mt-7 max-w-5xl font-display text-[clamp(2.4rem,6.5vw,5.25rem)] leading-[1.05] font-bold tracking-tight">
              Learn the computer skills that turn you into a
              <span className="animate-float mx-2 inline-flex h-[0.8em] w-[1.5em] translate-y-[0.08em] items-center justify-center rounded-[0.3em] bg-accent-yellow text-[0.5em] sm:mx-3">🖥️</span>
              <span className="text-shine bg-gradient-to-r from-brand-300 via-accent-glow to-brand-300 bg-clip-text text-transparent">professional</span>
            </h1>
            <p style={delay(2, 150)} className="hero-in mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              Basic Computer, MS Office, Advance Excel, Tally Prime with GST, Punjabi typing, CAD/CAM and graphic design, taught hands-on with one computer per student.
            </p>
            <div style={delay(3, 150)} className="hero-in mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#contact" className="inline-flex h-13 items-center justify-center rounded-full bg-white px-8 font-medium text-ink shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-glow/30">Book a free demo class</a>
              <a href="#courses" className="inline-flex h-13 items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 font-medium backdrop-blur transition-colors hover:bg-white/10">Explore courses</a>
            </div>
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[["👨‍🏫", "Expert trainers", "Patient, experienced faculty"], ["🖱️", "100% practical", "One computer per student"], ["📜", "Certified", "Certificate on completion"]].map(([icon, title, sub], i) => (
                <div key={title} style={delay(4 + i, 150)} className="hero-in flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur transition-colors hover:bg-white/10">
                  <span className="text-2xl">{icon}</span>
                  <span><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-sm text-white/70">{sub}</span></span>
                </div>
              ))}
            </div>
          </div>
          {/* Course ticker */}
          <div className="marquee absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/10 bg-white/5 py-3 backdrop-blur">
            <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} className="flex items-center gap-10 text-sm font-medium text-white/80">{item}<span className="text-accent-yellow">✦</span></span>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-2 lg:items-center">
            <div className="reveal reveal-left">
              <Pill>About Us</Pill>
              <h2 className="mt-5 font-display text-4xl leading-tight font-bold tracking-tight lg:text-5xl">
                Making <span className="text-brand-600">every student</span> computer-ready for work
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted lg:text-lg">
                GIT Education is a computer training institute in Jalandhar. From your first time on a computer to professional accounting, drafting and design software, we teach the skills that offices, businesses and government jobs ask for.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <ArrowButton href="#courses">Find your course</ArrowButton>
                <a href={tel} className="text-sm font-medium transition-colors hover:text-brand-600">
                  Talk to a counsellor<span className="mt-0.5 block font-mono text-xs text-muted">{PHONE}</span>
                </a>
              </div>
            </div>
            <div style={delay(2)} className="reveal reveal-right group relative overflow-hidden rounded-3xl shadow-2xl shadow-brand-900/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80" alt="Students practising in a computer lab" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/45 px-3 py-1 font-mono text-[10px] tracking-wider text-white uppercase backdrop-blur">GIT Education computer lab</span>
            </div>
          </div>
          <div className="mx-auto mt-20 max-w-6xl px-5">
            <div className="reveal">
              <span className="font-mono text-xs tracking-[0.18em] text-muted uppercase">How it works</span>
              <h3 className="mt-4 max-w-2xl font-display text-3xl leading-tight font-bold tracking-tight text-balance lg:text-4xl">From your first class to your first job</h3>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([phase, title, text], i) => (
                <div key={phase} style={delay(i, 120)} className="reveal lift flex overflow-hidden rounded-3xl border border-line bg-subtle hover:border-brand-200">
                  <span className="flex w-9 shrink-0 items-center justify-center bg-gradient-to-b from-brand-600 to-brand-700 font-mono text-[10px] tracking-[0.16em] text-white/85 uppercase [writing-mode:vertical-rl] rotate-180">{phase}</span>
                  <div className="p-5">
                    <span className="font-display text-sm text-muted">0{i + 1}</span>
                    <h4 className="mt-2 font-display text-lg font-bold tracking-tight">{title}</h4>
                    <p className="mt-3.5 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
          <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <Pill dark>Our Courses</Pill>
                <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight font-bold tracking-tight lg:text-5xl">Computer courses for every goal and every age</h2>
              </div>
              <ArrowButton href="#contact" variant="white">Enquire now</ArrowButton>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([title, text, gradient, icon], i) => (
                <a key={title} href="#contact" style={delay(i % 3, 110)} className={`reveal reveal-zoom lift group relative flex min-h-52 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br p-6 ${gradient}`}>
                  <div className="grid-overlay pointer-events-none absolute inset-0 opacity-60" />
                  <div className="pointer-events-none absolute -inset-y-4 -left-1/2 w-1/3 -skew-x-12 bg-white/20 blur-md transition-all duration-700 group-hover:left-[130%]" />
                  <span className="absolute top-5 right-5 text-4xl opacity-90 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12">{icon}</span>
                  <h3 className="relative font-display text-lg font-bold tracking-tight">{title}</h3>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-white/80">{text}</p>
                  <span className="relative mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">Enquire <span className="transition-transform group-hover:translate-x-1">→</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured courses */}
        <section id="courses" className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal text-center">
              <span className="inline-flex items-center rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide shadow-sm">Featured Courses</span>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight lg:text-5xl">Courses that get you <span className="text-brand-600">hired</span></h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg">Practical training, real assignments and job support behind every course.</p>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-6">
              <article style={delay(0)} className="reveal lift rounded-3xl border border-line bg-white p-6 shadow-sm md:col-span-2">
                <h3 className="text-center font-display text-lg font-bold tracking-tight">Tally Prime with GST</h3>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["GST Returns", "TDS", "Payroll", "Inventory", "Billing", "Balance Sheet"].map((t) => <span key={t} className="rounded-full border border-line bg-subtle px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand-300 hover:bg-brand-50">{t}</span>)}
                </div>
                <div className="animate-float mx-auto mt-6 grid size-24 place-items-center rounded-full bg-gradient-to-br from-ink to-brand-700 text-4xl">🧾</div>
              </article>
              <article style={delay(1)} className="reveal lift rounded-3xl border border-line bg-white p-6 shadow-sm md:col-span-2">
                <h3 className="text-center font-display text-lg font-bold tracking-tight">Advance Excel</h3>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold text-white">Pivot</span>
                  <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold text-white">Dashboards</span>
                </div>
                <div className="mt-6 flex h-28 items-end gap-2">
                  {[["Jan", 35], ["Feb", 48], ["Mar", 42], ["Apr", 60], ["May", 72], ["Jun", 90]].map(([m, h], i) => (
                    <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <div className="bar-grow w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-accent-400" style={{ height: `${h}%`, transitionDelay: `${400 + i * 100}ms` }} />
                      <span className="text-[10px] text-muted">{m}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article style={delay(2)} className="reveal lift flex flex-col items-center justify-center rounded-3xl bg-panel p-6 text-white md:col-span-2">
                <h3 className="text-center font-display text-lg font-bold tracking-tight">Punjabi Typing</h3>
                <span className="text-shine mt-2 bg-gradient-to-r from-brand-300 via-accent-glow to-brand-300 bg-clip-text font-display text-6xl font-extrabold text-transparent">ਪੰਜਾਬੀ</span>
                <p className="mt-2 text-center text-sm leading-relaxed text-white/70">Raavi &amp; Asees fonts · timed tests for government jobs</p>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-accent-400">ਟਾਈਪ ਕਰੋ<span className="h-4 w-0.5 animate-pulse bg-accent-400" /></span>
              </article>
              <article style={delay(0)} className="reveal reveal-left lift rounded-3xl border border-line bg-white p-6 shadow-sm md:col-span-3">
                <h3 className="text-center font-display text-lg font-bold tracking-tight">CAD / CAM</h3>
                <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-muted">AutoCAD, SolidWorks, CATIA, Creo and Revit for mechanical, civil and architecture students, with 2D drafting, 3D modelling and project drawings.</p>
                <div className="mt-6 flex items-center justify-center gap-8">
                  <div className="grid size-24 place-items-center rounded-3xl border-2 border-dashed border-brand-300 bg-brand-50 text-4xl"><span className="animate-[spin_12s_linear_infinite]">📐</span></div>
                  <ul className="space-y-2 text-sm">
                    {[["AutoCAD", "2D + 3D"], ["SolidWorks", "3D"], ["Revit", "BIM"]].map(([t, v]) => (
                      <li key={t} className="flex items-center justify-between gap-4">{t}<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{v}</span></li>
                    ))}
                  </ul>
                </div>
              </article>
              <article style={delay(1)} className="reveal reveal-right lift rounded-3xl border border-line bg-white p-6 shadow-sm md:col-span-3">
                <h3 className="text-center font-display text-lg font-bold tracking-tight">Graphic Design</h3>
                <div className="mx-auto mt-6 max-w-sm space-y-3">
                  {[["🖼️", "Photoshop", "Photo editing & social media posts"], ["✒️", "CorelDRAW & Illustrator", "Logos, banners & visiting cards"], ["📰", "InDesign & PageMaker", "Magazines, brochures & DTP"]].map(([icon, title, sub]) => (
                    <div key={title} className="flex items-center gap-3 rounded-2xl border border-line bg-subtle px-4 py-3 transition-all duration-300 hover:translate-x-1 hover:border-brand-200 hover:bg-brand-50">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm">{icon}</span>
                      <span className="min-w-0"><span className="block truncate text-sm font-semibold">{title}</span><span className="block text-xs text-muted">{sub}</span></span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="reveal reveal-zoom text-shine flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 p-6 text-white md:col-span-6 md:flex-row">
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight">Basic Computer + MS Office</h3>
                  <p className="mt-1 text-sm text-white/80">The perfect first course: Windows, internet, Word, Excel, PowerPoint and typing basics.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Windows", "Internet", "Word", "Excel", "PowerPoint"].map((t) => <span key={t} className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">{t}</span>)}
                </div>
              </article>
            </div>
            <div className="mt-12 flex justify-center"><ArrowButton href="#contact">Ask about fees &amp; batches</ArrowButton></div>
          </div>
        </section>

        {/* Difference */}
        <section id="difference" className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.3fr]">
            <div className="reveal reveal-left lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-display text-4xl leading-tight font-bold tracking-tight lg:text-5xl"><span className="text-brand-600">/</span> The GIT Education Difference</h2>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted">
                Students and parents in Jalandhar choose us for patient teaching, a well-equipped computer lab and courses that lead to real jobs.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                <a href={tel} className="group inline-flex items-center gap-1.5 font-medium text-brand-600 hover:text-brand-700">Call Now <span className="transition-transform group-hover:translate-x-1">→</span></a>
                <a href="#contact" className="group inline-flex items-center gap-1.5 font-medium text-brand-600 hover:text-brand-700">Book a Free Demo <span className="transition-transform group-hover:translate-x-1">→</span></a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {differences.map(([title, text], i) => (
                <div key={title} style={delay(i, 120)} className="reveal lift group rounded-3xl border border-line bg-subtle p-6 hover:border-brand-200 hover:bg-white">
                  <span className="grid size-11 place-items-center rounded-2xl bg-brand-600 text-lg text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">{["📚", "🎓", "🤝", "🗓️"][i]}</span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="relative overflow-hidden border-t border-line bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h2 className="max-w-xl font-display text-4xl leading-tight font-bold tracking-tight lg:text-5xl">What our students say about GIT Education</h2>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5"><span className="text-accent-yellow">★</span> <Counter to={4.9} decimals={1} />/5 Rating</span>
                  <span className="inline-flex items-center gap-1.5">💬 <Counter to={500} suffix="+" /> Reviews</span>
                  <span className="inline-flex items-center gap-1.5">🎓 <Counter to={10} suffix="K+" /> Students trained</span>
                </div>
              </div>
              <ArrowButton href="#contact" variant="panel">Get started today</ArrowButton>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map(([initials, name, role, text, gradient], i) => (
                <figure key={name} style={delay(i % 3, 120)} className="reveal lift flex flex-col rounded-3xl border border-line bg-subtle p-6 hover:border-brand-200 hover:bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm tracking-widest text-accent-yellow">★★★★★</span>
                    <span className="text-[10px] font-semibold tracking-wide text-muted">Google</span>
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed">&ldquo;{text}&rdquo;</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white ${gradient}`}>{initials}</span>
                    <span className="min-w-0"><span className="block text-sm font-semibold">{name}</span><span className="block truncate text-xs text-muted">{role}</span></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="relative isolate overflow-clip bg-panel py-20 text-white lg:py-28">
          <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.4fr]">
            <div className="reveal reveal-left lg:sticky lg:top-28 lg:self-start">
              <Pill dark>Included</Pill>
              <h2 className="mt-5 font-display text-4xl leading-tight font-bold tracking-tight lg:text-5xl">Included with every course we run</h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-white/65">Whichever course and batch you choose, all of this comes as standard.</p>
            </div>
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {modules.map(([title, text], i) => (
                <li key={title} style={delay(i, 80)} className="reveal reveal-right group py-7">
                  <span className="font-mono text-xs text-white/40 transition-colors group-hover:text-accent-400">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2 lg:text-2xl">{title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 lg:text-base">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Software */}
        <section id="software" className="bg-subtle py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-5 text-center">
            <div className="reveal">
              <span className="inline-flex items-center rounded-full border border-line bg-white px-4 py-1.5 text-xs font-medium tracking-wide">Software</span>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight lg:text-5xl">Software We Teach</h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg">From everyday office tools to professional accounting, drafting and design software.</p>
            </div>
            <div style={delay(2)} className="reveal mt-10 flex gap-2 overflow-x-auto pb-2 sm:justify-center">
              {Object.keys(softwareTabs).map((tab) => (
                <button key={tab} onClick={() => setSoftwareTab(tab)} className={`rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ${softwareTab === tab ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25" : "text-muted hover:bg-white hover:text-foreground"}`}>{tab}</button>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {softwareTabs[softwareTab].map((item, i) => (
                <div key={`${softwareTab}-${item}`} style={delay(i, 50)} className="hero-in group flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-4 text-left transition-colors hover:border-brand-300 hover:shadow-md hover:shadow-brand-600/10">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 font-display text-sm font-bold text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">{item[0]}</span>
                  <span className="truncate text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center"><ArrowButton href="#contact">Enquire about a course</ArrowButton></div>
          </div>
        </section>

        {/* Careers */}
        <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
          <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal">
              <Pill dark>Career Paths</Pill>
              <h2 className="mt-5 max-w-3xl font-display text-4xl leading-tight font-bold tracking-tight lg:text-5xl">Pick a career, and we&apos;ll show you the courses for it</h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
              <div className="reveal reveal-left flex flex-col gap-1">
                {careers.map(([title], i) => (
                  <button key={title} onClick={() => setCareer(i)} className={`flex items-center justify-between rounded-2xl px-5 py-4 text-left font-medium transition-colors ${career === i ? "bg-brand-600 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                    <span>{title}</span><span>{career === i ? "→" : ""}</span>
                  </button>
                ))}
              </div>
              <div style={delay(2)} className="reveal reveal-right rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:p-8">
                <div key={career}>
                  <h3 className="hero-in font-display text-2xl font-bold tracking-tight">{careers[career][0]}</h3>
                  <p style={delay(1)} className="hero-in mt-3 mb-6 max-w-2xl text-sm leading-relaxed text-white/75">{careers[career][1]}</p>
                  <p className="mb-3 font-mono text-xs tracking-[0.16em] text-white/50 uppercase">Recommended courses</p>
                  <div className="grid grid-cols-2 gap-3">
                    {careers[career][2].map((c, i) => (
                      <span key={c} style={delay(i + 2, 70)} className="hero-in rounded-2xl bg-white px-4 py-3 text-center text-sm font-medium text-foreground">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-8"><a href="#contact" className="group inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 py-2 pr-2 pl-7 text-sm font-semibold transition-colors hover:bg-white/15">Get career advice<span className="grid size-9 place-items-center rounded-full bg-white text-brand-700">→</span></a></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-5">
            <div className="reveal text-center">
              <h2 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">Frequently asked questions</h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg">Quick answers about our courses, batches, fees and certificates.</p>
            </div>
            <div className="mt-12 space-y-3">
              {faqs.map(([q, a], i) => {
                const open = openFaq === i;
                return (
                  <div key={q} style={delay(i, 70)} className="reveal">
                  <div className={`overflow-hidden rounded-2xl border transition-colors ${open ? "border-brand-200 bg-brand-50/60" : "border-line bg-white hover:border-brand-200"}`}>
                    <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open} className="flex w-full items-center gap-4 px-6 py-5 text-left lg:px-7">
                      <span className="flex-1 text-base font-medium tracking-tight lg:text-[1.0625rem]">{q}</span>
                      <span className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-sm transition-all duration-300 ${open ? "rotate-45 bg-brand-600 text-white" : "bg-subtle text-muted"}`}>+</span>
                    </button>
                    {/* Smooth height animation via grid-template-rows */}
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 text-sm leading-relaxed text-muted lg:px-7">{a}</div>
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
          <div className="reveal -mb-px flex flex-col items-start justify-between gap-6 border-b border-line py-10 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight lg:text-2xl">Ready to start learning?</h3>
              <p className="mt-1.5 text-sm text-muted">Book a free demo class and see our computer lab before you decide.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${EMAIL}?subject=Free%20demo%20class`} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-700">Book Free Demo →</a>
              <a href={tel} className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-medium transition-colors hover:border-brand-600 hover:text-brand-600">📞 {PHONE}</a>
            </div>
          </div>
          <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
            <div>
              <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
                <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-sm font-extrabold text-white">GIT</span>
                GIT <span className="-ml-1 text-brand-600">Education</span>
              </a>
              <p className="mt-5 text-sm leading-relaxed text-muted">Computer Training Institute</p>
              <ul className="mt-5 space-y-2 text-xs leading-relaxed text-muted">
                <li>📍 Jalandhar, Punjab, India</li>
                <li><a href={tel} className="font-mono hover:text-brand-600">📞 {PHONE}</a></li>
                <li><a href={`mailto:${EMAIL}`} className="hover:text-brand-600">✉️ {EMAIL}</a></li>
                <li>🕘 Mon – Sat, 8 AM – 7 PM</li>
              </ul>
            </div>
            {footerCols.map(([heading, links]) => (
              <div key={heading}>
                <p className="font-display text-sm font-bold tracking-tight uppercase">{heading}</p>
                <ul className="mt-4 space-y-2.5">
                  {links.map((l) => <li key={l}><a href="#courses" className="text-sm text-muted transition-colors duration-200 hover:text-brand-600">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 border-t border-line py-6 text-xs text-muted/80 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {["Privacy Policy", "Terms & Conditions", "Refund Policy"].map((l) => <a key={l} href="#top" className="hover:text-brand-600">{l}</a>)}
            </nav>
            <p>© {new Date().getFullYear()} GIT Education · <span className="font-medium text-foreground/60">Jalandhar, Punjab</span></p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <a href="#top" aria-label="Back to top" className={`fixed right-6 bottom-24 z-40 grid size-11 place-items-center rounded-full bg-panel text-white shadow-xl shadow-black/20 transition-all duration-500 hover:-translate-y-1 hover:bg-brand-600 ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>↑</a>

      {/* WhatsApp */}
      <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="animate-pulse-ring fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl shadow-black/20 transition-transform hover:scale-110">
        <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.2-.6-.4zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6zm0-21.6A11.8 11.8 0 0 0 1.8 17.9L.1 24l6.3-1.6A11.8 11.8 0 1 0 12 .2z" /></svg>
      </a>
    </>
  );
}
