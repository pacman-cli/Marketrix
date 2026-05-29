"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

const sections = [
  {
    title: "Product",
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Submit a brief", href: "/submit-brief" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Analyst network", href: "/marketplace" },
      { label: "Research desk", href: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)] text-white">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-sm font-black text-[var(--ink)]">
                MX
              </span>
              <span>
                <span className="block font-extrabold">Marketrix</span>
                <span className="mono text-[0.64rem] font-semibold uppercase text-white/55">
                  Signal desk
                </span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-7 text-white/64">
              Marketrix gives founders a calmer way to turn messy research questions into
              ranked reports, analyst matches, and next actions.
            </p>
            <Link href="/submit-brief" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-white">
              Start a research brief
              <ArrowRight size={16} />
            </Link>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-extrabold text-white">{section.title}</h3>
              <div className="grid gap-3">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-white/62 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/12 pt-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <span>(c) 2026 Marketrix. Professional market intelligence workspace.</span>
          <a href="mailto:hello@marketrix.local" className="inline-flex items-center gap-2 hover:text-white">
            <Mail size={16} />
            hello@marketrix.local
          </a>
        </div>
      </div>
    </footer>
  );
}
