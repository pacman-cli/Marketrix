"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check, Search, SlidersHorizontal } from "lucide-react";

const steps = [
  {
    icon: SlidersHorizontal,
    title: "Frame the question",
    detail: "Industry, stage, geography, budget, and goals become a structured intelligence brief.",
  },
  {
    icon: Search,
    title: "Match the signal",
    detail: "The marketplace filters reports and analysts by category, evidence, price, and fit.",
  },
  {
    icon: BookOpen,
    title: "Review the evidence",
    detail: "Preview outcomes, expected delivery, match score, and analyst context before buying.",
  },
  {
    icon: Check,
    title: "Move to action",
    detail: "Saved briefs appear in the dashboard with recommended research and next steps.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-pad bg-[var(--ink)] text-white">
      <div className="container">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow text-white/70">Operating rhythm</span>
            <h2 className="mt-4 text-5xl text-white md:text-6xl">From raw question to ranked answer.</h2>
          </div>
          <Link href="/submit-brief" className="btn-primary bg-white text-[var(--ink)] hover:bg-[var(--gold-soft)]">
            Run the workflow
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-white/14 bg-white/14 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="bg-[rgba(255,255,255,0.06)] p-7">
                <div className="mb-8 flex items-center justify-between">
                  <span className="mono text-xs font-semibold uppercase text-white/42">
                    Step 0{index + 1}
                  </span>
                  <Icon size={22} className="text-[var(--gold)]" />
                </div>
                <h3 className="font-sans text-xl font-extrabold leading-7 text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/62">{step.detail}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
