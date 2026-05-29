"use client";

import Link from "next/link";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="signal-hero">
      <div className="signal-stage">
        <div className="signal-card signal-card-a p-5">
          <div className="mb-6 flex items-center justify-between">
            <span className="mono text-xs font-semibold uppercase text-white/55">Live demand map</span>
            <span className="flex items-center gap-2 text-sm font-bold text-white/80">
              <span className="pulse-dot" />
              28 signals
            </span>
          </div>
          <div className="grid gap-4">
            {[
              ["B2B SaaS pricing", "92%", "bar-teal"],
              ["AI workflow adoption", "86%", "bar-rust"],
              ["FinTech trust levers", "74%", "bar-gold"],
              ["EdTech procurement", "68%", "bar-teal"],
            ].map(([label, width, tone]) => (
              <div key={label} className="grid gap-2">
                <div className="flex justify-between text-sm text-white/74">
                  <span>{label}</span>
                  <span>{width}</span>
                </div>
                <span className="bar">
                  <span className={`bar ${tone}`} style={{ width }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="signal-card signal-card-b p-5">
          <span className="mono text-xs font-semibold uppercase text-white/55">Research queue</span>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {["Intake", "Match", "Ready"].map((item, index) => (
              <div key={item} className="rounded-lg border border-white/12 p-3">
                <span className="mono text-xs text-white/48">0{index + 1}</span>
                <p className="mt-2 text-sm font-extrabold text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="signal-card signal-card-c p-5">
          <span className="mono text-xs font-semibold uppercase text-white/55">Analyst fit</span>
          <div className="mt-6 text-6xl display text-white">98</div>
          <p className="mt-2 text-sm text-white/62">relevance score for your next brief</p>
        </div>
      </div>

      <div className="container relative z-10 flex min-h-[calc(100vh-72px)] items-center py-24">
        <div className="max-w-3xl animate-rise">
          <div className="eyebrow mb-6 text-white/82">
            <ShieldCheck size={16} />
            Market intelligence operating system
          </div>
          <h1 className="text-[4.4rem] leading-[0.9] md:text-[7rem]">
            Know the market before it moves.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/74 md:text-xl">
            Marketrix turns founder briefs into ranked research, analyst matches, and
            board-ready evidence without the enterprise consulting drag.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/submit-brief" className="btn-primary bg-white text-[var(--ink)] hover:bg-[var(--gold-soft)]">
              Start a brief
              <ArrowRight size={18} />
            </Link>
            <Link href="/marketplace" className="btn-secondary border-white/25 bg-white/10 text-white hover:bg-white/16">
              <Search size={18} />
              Browse reports
            </Link>
          </div>
          <div className="mt-14 grid max-w-2xl grid-cols-3 gap-4">
            {[
              ["2,400+", "research assets"],
              ["850+", "expert analysts"],
              ["10 min", "first match"],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-white/24 pl-4">
                <div className="display text-4xl text-white">{value}</div>
                <p className="mt-1 text-sm font-bold uppercase text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
