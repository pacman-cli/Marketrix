"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Database, ShieldCheck, Users } from "lucide-react";

const principles = [
  {
    icon: Database,
    title: "Evidence before opinion",
    detail:
      "Every report preview is framed around outcomes, assumptions, and where the evidence is strongest.",
  },
  {
    icon: Users,
    title: "Analysts are operators",
    detail:
      "Market experts should sell focused intelligence, not disappear inside slow consulting procurement.",
  },
  {
    icon: ShieldCheck,
    title: "Accessible by design",
    detail:
      "Founders can start with a specific question, a report preview, and a sane budget before custom work.",
  },
];

const team = [
  ["Alex Chen", "Founder and research operations"],
  ["Sarah Rodriguez", "Product and marketplace systems"],
  ["James Park", "Matching infrastructure"],
  ["Emma Watson", "Analyst network strategy"],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20">
      <section className="border-b border-[var(--line)] bg-white/62 py-16">
        <div className="container grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <span className="eyebrow">About Marketrix</span>
            <h1 className="mt-4 text-6xl md:text-7xl">We make research easier to trust.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8">
              Marketrix exists for teams that need market clarity without waiting months
              for a consulting cycle. It connects structured founder briefs with vetted
              reports and analysts.
            </p>
          </div>
          <div className="surface p-6">
            <BadgeCheck size={28} className="text-[var(--teal)]" />
            <p className="mt-5 text-sm leading-7">
              The product is intentionally practical: a marketplace, a guided brief intake,
              and a dashboard that keeps active research visible.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="eyebrow">Origin</span>
            <h2 className="mt-4 text-5xl md:text-6xl">The old way wastes both sides.</h2>
          </div>
          <div className="grid gap-5 text-lg leading-8">
            <p>
              A founder spends five figures on a broad market study and uses one chart.
              A great researcher has valuable category work sitting in private folders.
              Both sides are losing time because the buying workflow is too blunt.
            </p>
            <p>
              Marketrix turns that gap into a focused exchange: founders describe the
              decision they need to make, the platform ranks relevant research, and analysts
              can step in where custom context matters.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-[var(--line)] bg-white/54">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow">Principles</span>
            <h2 className="mt-4 text-5xl md:text-6xl">Professional, not performative.</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <article key={principle.title} className="bg-white p-7">
                  <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--teal-soft)] text-[var(--teal)]">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-sans text-xl font-extrabold leading-7">{principle.title}</h3>
                  <p className="mt-4 text-sm leading-7">{principle.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="eyebrow">Team</span>
            <h2 className="mt-4 text-5xl md:text-6xl">Built by people who read the footnotes.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {team.map(([name, role]) => (
              <article key={name} className="quiet-surface p-5">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-[var(--ink)] text-sm font-black text-white">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <h3 className="font-sans text-lg font-extrabold">{name}</h3>
                <p className="mt-2 text-sm">{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--teal-soft)] p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="eyebrow">Next step</span>
              <h2 className="mt-3 text-5xl">Bring us the market question.</h2>
            </div>
            <Link href="/submit-brief" className="btn-primary">
              Start a brief
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
