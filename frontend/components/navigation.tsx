"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/submit-brief", label: "Brief" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(244,246,242,0.86)] backdrop-blur-xl">
      <nav className="container flex min-h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--ink)] text-sm font-black text-white">
            MX
          </span>
          <span className="leading-none">
            <span className="block font-extrabold tracking-tight text-[var(--ink)]">
              Marketrix
            </span>
            <span className="mono text-[0.64rem] font-semibold uppercase text-[var(--muted)]">
              Signal desk
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-white/70 p-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "nav-pill-active" : "nav-pill"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/dashboard" className="btn-ghost">
            Log in
          </Link>
          <Link href="/submit-brief" className="btn-primary">
            Start brief
            <ArrowRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--line-strong)] bg-white text-[var(--ink)] md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-[var(--line)] bg-[var(--paper)] md:hidden">
          <div className="container py-4">
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-4 py-3 text-sm font-extrabold ${
                    isActive(link.href)
                      ? "bg-[var(--ink)] text-white"
                      : "bg-white/70 text-[var(--ink-soft)]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
