"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { openEnquiry } from "@/components/enquiry-modal";
import { Icon } from "@/components/icon";
import {
  MAIL_HREF,
  SITE,
  TEL_HREF,
  branches,
  certificateHref,
  certificatePrograms,
  courseGroups,
  courseHref,
  megaMenus,
  navLinks,
  type MegaMenuData,
} from "@/lib/site";

/**
 * Site header.
 *
 * Two states, one component:
 * - At the top of the page it is a full-width official bar — utility strip with
 *   registration and helpline details above the main navigation, sitting over the
 *   dark hero every page opens with.
 * - Once scrolled it collapses into a centred glass pill and the utility strip
 *   folds away.
 *
 * Interaction contract:
 * - Each dropdown is a button with `aria-expanded` / `aria-controls`. Pointer users
 *   get hover-open; keyboard and touch users get click-open. Escape closes and
 *   returns focus to the trigger. A click outside closes.
 * - The mobile drawer locks body scroll, moves focus to the panel and traps Escape.
 * - Nothing opens on hover alone for touch devices (`pointer: fine` is checked).
 */

const PANEL_TRANSITION = { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fine;
}

/** One dropdown trigger + panel, with the full keyboard contract. */
function NavDropdown({
  label,
  wide = true,
  openId,
  setOpenId,
  children,
}: {
  label: string;
  wide?: boolean;
  openId: string | null;
  setOpenId: React.Dispatch<React.SetStateAction<string | null>>;
  children: React.ReactNode;
}) {
  const id = useId();
  const open = openId === id;
  const finePointer = useFinePointer();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const close = useCallback(
    (returnFocus = false) => {
      setOpenId(null);
      if (returnFocus) triggerRef.current?.focus();
    },
    [setOpenId],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close(true);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const hoverOpen = () => {
    if (!finePointer) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenId(id);
  };

  const hoverClose = () => {
    if (!finePointer) return;
    // Only close if this menu is still the open one; if the pointer has moved on to
    // another dropdown in the meantime, leave that one open.
    closeTimer.current = setTimeout(() => setOpenId((current) => (current === id ? null : current)), 120);
  };

  return (
    <div
      ref={wrapperRef}
      // Narrow panels anchor under their own trigger; wide ones span the whole nav
      className={`group flex items-center self-stretch ${wide ? "" : "relative"}`}
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpenId((current) => (current === id ? null : current));
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        // Mouse users already opened it by hovering, so a click keeps it open rather
        // than toggling it shut; touch users get a plain toggle.
        onClick={() => setOpenId(open && !finePointer ? null : id)}
        className="nav-link inline-flex cursor-pointer items-center gap-1 whitespace-nowrap"
      >
        {label}
        <svg viewBox="0 0 12 12" aria-hidden="true" className={`size-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="group"
            aria-labelledby={`${id}-trigger`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={PANEL_TRANSITION}
            className={
              wide
                ? "absolute inset-x-0 top-full px-3 pt-2"
                : "absolute top-full left-1/2 w-60 -translate-x-1/2 pt-2"
            }
          >
            <div className="mx-auto max-w-[1240px] overflow-hidden rounded-3xl border border-line/80 bg-white font-sans text-foreground shadow-overlay">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MegaMenuPanel({ menu, label }: { menu: MegaMenuData; label: string }) {
  return (
    <div className="grid gap-8 p-6 lg:grid-cols-[minmax(196px,236px)_1fr]">
      <div className="flex flex-col justify-center lg:border-r lg:border-foreground/10 lg:pr-8">
        <ul className="-mx-2.5">
          {menu.links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[15px] leading-snug font-semibold tracking-tight text-foreground/80 transition-colors duration-200 hover:bg-action/10 hover:text-action"
              >
                <span className="truncate">{link.label}</span>
                {link.badge && (
                  <span className="ml-auto shrink-0 rounded-full bg-action/10 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.08em] text-action uppercase">
                    {link.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={menu.cta.href} className="group/cta mt-5 ml-0.5 inline-flex items-center gap-2 text-[13px] font-semibold text-action">
          {menu.cta.label}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
        </Link>
      </div>
      <ul className="hidden grid-cols-3 gap-5 lg:grid">
        {menu.featured.map((item) => (
          <li key={item.title}>
            <Link href={item.href} className="group/card block">
              <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-subtle ring-1 ring-foreground/5">
                <Image src={item.image} alt="" fill sizes="220px" className="object-cover transition-transform duration-700 group-hover/card:scale-105" />
              </span>
              <span className="mt-2.5 block text-[13.5px] leading-snug font-bold tracking-tight text-balance transition-colors duration-300 group-hover/card:text-action">
                {item.title}
              </span>
              <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="rounded-md bg-action/10 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.06em] text-action uppercase">{item.tag}</span>
                <span className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">{item.meta}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="sr-only">End of {label} menu</p>
    </div>
  );
}

function CoursesPanel() {
  return (
    <>
      <div className="grid gap-6 p-6 font-normal sm:grid-cols-2 lg:grid-cols-5 lg:gap-7 lg:p-8">
        {courseGroups.map((group, index) => (
          <div key={group.title}>
            <div className="mb-4 border-b border-foreground/10 pb-3">
              <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-1 text-lg tracking-tight">{group.title}</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{group.blurb}</p>
            </div>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link href={courseHref(item)} className="group/link flex items-start gap-2 text-sm text-foreground/75 transition-colors duration-200 hover:text-action">
                    <span aria-hidden="true" className="mt-2.5 h-px w-0 shrink-0 bg-action transition-all duration-300 group-hover/link:w-3" />
                    <span className="leading-snug">{item.label}</span>
                    {item.badge && <span className="mt-0.5 shrink-0 rounded-full bg-action/10 px-2 py-0.5 text-[10px] font-semibold text-action">{item.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 bg-subtle px-6 py-4 lg:px-8">
        <p className="text-sm text-muted">
          All courses include a certificate, one computer per student and placement support.
        </p>
        <Link href="/courses" className="group/all inline-flex items-center gap-2 text-sm font-semibold text-action">
          Browse all courses
          <span aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-1">→</span>
        </Link>
      </div>
    </>
  );
}

function CertificateProgramsPanel() {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 p-8">
        {certificatePrograms.map((program) => (
          <Link
            key={program.label}
            href={certificateHref(program.slug)}
            className="group/card flex items-center gap-3 rounded-2xl border border-line/70 bg-white/60 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-action/40 hover:bg-white hover:shadow-[0_10px_28px_-14px_rgba(15,23,42,0.35)]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-action/10 text-action transition-colors duration-200 group-hover/card:bg-action group-hover/card:text-white">
              <Icon name={program.icon} className="size-5" />
            </span>
            <span className="min-w-0 flex-1 text-sm leading-snug font-medium text-foreground/80 transition-colors duration-200 group-hover/card:text-action">{program.label}</span>
            {program.badge && <span className="shrink-0 rounded-full bg-action/10 px-2 py-0.5 text-[10px] font-semibold text-action">{program.badge}</span>}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 bg-subtle px-8 py-4">
        <figure className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="text-3xl leading-none font-bold text-action/25">&ldquo;</span>
          <blockquote className="text-sm leading-snug text-muted italic">
            Everybody should learn to program a computer, because it teaches you how to think.
            <cite className="ml-1.5 font-medium text-foreground not-italic">— Steve Jobs</cite>
          </blockquote>
        </figure>
        <Link href="/certificate-programs" className="group/all inline-flex items-center gap-2 text-sm font-medium text-action">
          See all certificate programs
          <span aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-1">→</span>
        </Link>
      </div>
    </>
  );
}

function BranchesPanel() {
  return (
    <ul className="p-2">
      {branches.map((branch) => (
        <li key={branch.city}>
          <a
            href={branch.href}
            {...(branch.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="group/link flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground/75 transition-colors duration-200 hover:bg-subtle hover:text-action"
          >
            <span aria-hidden="true" className="h-px w-0 shrink-0 bg-action transition-all duration-300 group-hover/link:w-3" />
            <span className="leading-snug">{branch.city}</span>
            {branch.external && <span className="sr-only">(opens in a new tab)</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Collapse to the compact pill after the first screenful.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 40);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on navigation. Adjusted during render rather than in an
  // effect, so the new page never paints with the previous page's menu open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setOpenId(null);
  }

  // Drawer: lock scroll, move focus in, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header className={`no-print fixed inset-x-0 top-0 z-50 ${solid ? "px-3 pt-3 sm:px-4" : ""}`}>
      {/* Official utility strip — folds away once the page is scrolled. */}
      <motion.div
        aria-label="Institute information"
        initial={false}
        animate={{ height: solid ? 0 : "auto", opacity: solid ? 0 : 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden border-b border-white/10 bg-panel/85 text-white backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2 text-[11.5px] tracking-wide lg:px-10">
          <p className="hidden items-center gap-2 text-white/75 sm:flex">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-yellow" />
            {SITE.legalName} · {SITE.registration}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/75">
            <li className="hidden sm:block">{SITE.hours}</li>
            <li>
              <a href={TEL_HREF} className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-yellow">
                <Icon name="phone" className="size-3.5" />
                <span className="sr-only">Helpline </span>
                {SITE.phone}
              </a>
            </li>
            <li className="hidden md:block">
              <a href={MAIL_HREF} className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-yellow">
                <Icon name="mail" className="size-3.5" />
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </motion.div>

      <nav
        aria-label="Primary"
        className={`relative mx-auto flex items-center justify-between border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          solid
            ? "max-w-[1240px] rounded-[28px] border-line/80 bg-white/95 px-3 py-2.5 text-foreground shadow-[0_8px_32px_-8px_rgb(13_19_48/0.18)] backdrop-blur-xl [--nav-accent:var(--color-action)] sm:px-4 lg:px-6 2xl:max-w-[1400px]"
            : "max-w-full rounded-none border-transparent border-b-white/10 bg-transparent px-5 py-3.5 text-white lg:px-10"
        }`}
      >
        <Link href="/" aria-label={`${SITE.name} home`} className="group flex shrink-0 items-center">
          <Image
            src="/images/logo/tce.png"
            alt={SITE.name}
            width={952}
            height={262}
            priority
            className={`w-auto transition-[filter,height,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
              solid ? "h-8 sm:h-9 lg:h-10" : "h-9 brightness-0 invert sm:h-10 lg:h-12"
            }`}
          />
        </Link>

        <div className="hidden items-center gap-5 self-stretch text-[13px] font-medium xl:flex">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={`nav-link ${pathname === "/" ? "opacity-100" : ""}`}>
            Home
          </Link>

          <NavDropdown label="About" openId={openId} setOpenId={setOpenId}>
            <MegaMenuPanel menu={megaMenus.About} label="About" />
          </NavDropdown>

          <Link href="/courses" className="shine-sweep rounded-full bg-accent-yellow px-3.5 py-1 font-semibold text-ink">
            New Batches
          </Link>

          <NavDropdown label="Courses" openId={openId} setOpenId={setOpenId}>
            <CoursesPanel />
          </NavDropdown>

          <NavDropdown label="Certificate Programs" openId={openId} setOpenId={setOpenId}>
            <CertificateProgramsPanel />
          </NavDropdown>

          <Link href="/#difference" className="nav-link hidden 2xl:inline">
            Why Us
          </Link>
          <Link href="/#reviews" className="nav-link hidden 2xl:inline">
            Reviews
          </Link>

          <NavDropdown label="Resources" openId={openId} setOpenId={setOpenId}>
            <MegaMenuPanel menu={megaMenus.Resources} label="Resources" />
          </NavDropdown>

          <NavDropdown label="Branches" wide={false} openId={openId} setOpenId={setOpenId}>
            <BranchesPanel />
          </NavDropdown>

          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={TEL_HREF}
            className={`hidden h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-300 sm:inline-flex xl:hidden ${
              solid ? "bg-subtle text-foreground hover:bg-line" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Icon name="phone" className="size-4" />
            Call
          </a>
          <button
            type="button"
            onClick={openEnquiry}
            className={`hidden h-9 cursor-pointer items-center rounded-full px-5 text-sm font-semibold transition-all duration-300 hover:bg-accent-yellow hover:text-ink sm:inline-flex ${
              solid ? "bg-action text-white" : "bg-white text-ink"
            }`}
          >
            Book Free Demo
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-current/25 transition-colors hover:bg-current/10 xl:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={drawerRef}
            tabIndex={-1}
            // Close on any link tap. Route changes already close it, but in-page links
            // (/#about, /#contact…) don't change the path and would leave it open.
            onClick={(event) => {
              if ((event.target as Element).closest("a")) setMenuOpen(false);
            }}
            // Let the mouse wheel scroll the drawer instead of Lenis scrolling the page
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={PANEL_TRANSITION}
            className="mx-auto mt-2 max-h-[calc(100dvh-7rem)] max-w-[1240px] overflow-y-auto rounded-3xl border border-line bg-white p-4 shadow-overlay outline-none xl:hidden"
          >
            <ul className="divide-y divide-line">
              {navLinks
                .map(([label, href]) =>
                  label === "Courses" ? (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => setMobileSection((section) => (section === "courses" ? null : "courses"))}
                        aria-expanded={mobileSection === "courses"}
                        aria-controls="mobile-courses"
                        className="flex w-full cursor-pointer items-center justify-between py-3.5 font-display text-lg font-semibold tracking-tight"
                      >
                        Courses
                        <span aria-hidden="true" className={`text-sm text-muted transition-transform duration-300 ${mobileSection === "courses" ? "rotate-90" : ""}`}>
                          →
                        </span>
                      </button>
                      <div id="mobile-courses" className={`grid transition-[grid-template-rows] duration-300 ease-out ${mobileSection === "courses" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <div className="overflow-hidden">
                          <div className="space-y-4 pb-4">
                            {courseGroups.map((group, index) => (
                              <div key={group.title}>
                                <p className="flex items-baseline gap-2 border-b border-foreground/10 pb-1.5 text-sm font-semibold tracking-tight">
                                  <span className="font-mono text-[11px] font-normal text-muted">{String(index + 1).padStart(2, "0")}</span>
                                  {group.title}
                                </p>
                                <ul className="mt-1.5 grid grid-cols-2 gap-x-3">
                                  {group.items.map((item) => (
                                    <li key={item.label}>
                                      <Link
                                        href={courseHref(item)}
                                        className="flex items-center gap-1.5 rounded-lg px-1 py-1.5 text-sm text-foreground/75 transition-colors hover:text-action"
                                      >
                                        <span className="leading-snug">{item.label}</span>
                                        {item.badge && <span className="shrink-0 rounded-full bg-action/10 px-1.5 py-0.5 text-[9px] font-semibold text-action">{item.badge}</span>}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            <Link href="/courses" className="flex items-center gap-2 px-1 text-[15px] font-semibold text-action">
                              View all courses →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ) : label === "Certificate Programs" ? (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => setMobileSection((section) => (section === "certificates" ? null : "certificates"))}
                        aria-expanded={mobileSection === "certificates"}
                        aria-controls="mobile-certificates"
                        className="flex w-full cursor-pointer items-center justify-between py-3.5 font-display text-lg font-semibold tracking-tight"
                      >
                        Certificate Programs
                        <span aria-hidden="true" className={`text-sm text-muted transition-transform duration-300 ${mobileSection === "certificates" ? "rotate-90" : ""}`}>
                          →
                        </span>
                      </button>
                      <div
                        id="mobile-certificates"
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${mobileSection === "certificates" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden" inert={mobileSection !== "certificates"}>
                          <ul className="grid grid-cols-2 gap-2 pb-4">
                            {certificatePrograms.map((program) => (
                              <li key={program.slug}>
                                <Link
                                  href={certificateHref(program.slug)}
                                  className="flex items-center gap-2 rounded-xl border border-line/70 px-2.5 py-2 text-sm text-foreground/80 transition-colors hover:border-action/40 hover:text-action"
                                >
                                  <Icon name={program.icon} className="size-4 shrink-0 text-action" />
                                  <span className="leading-snug">{program.label}</span>
                                </Link>
                              </li>
                            ))}
                            <li className="col-span-2">
                              <Link href={href} className="flex items-center gap-2 px-1 pt-1 text-[15px] font-semibold text-action">
                                View all certificate programs →
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li key={label}>
                      <Link href={href} className="flex items-center justify-between py-3.5 font-display text-lg font-semibold tracking-tight">
                        {label}
                        <span aria-hidden="true" className="text-sm text-muted">→</span>
                      </Link>
                    </li>
                  ),
                )}
            </ul>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a href={TEL_HREF} className="flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/20 font-semibold">
                <Icon name="phone" className="size-4" />
                Call us
              </a>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openEnquiry();
                }}
                className="flex h-12 cursor-pointer items-center justify-center rounded-full bg-panel font-semibold text-white"
              >
                Book free demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
