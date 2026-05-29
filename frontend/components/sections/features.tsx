"use client";

import { BadgeCheck, Bot, Database, PanelRight, ShieldCheck, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Brief-to-signal matching",
    description:
      "Structured intake parses market, stage, geography, budget, and urgency into a ranked research map.",
  },
  {
    icon: Database,
    title: "Curated research inventory",
    description:
      "Reports are normalized by category, price, evidence depth, outcomes, and analyst fit.",
  },
  {
    icon: PanelRight,
    title: "Decision workspace",
    description:
      "Shortlist reports, compare match scores, and keep active briefs visible from the dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Founder-safe workflow",
    description:
      "No hidden consulting retainer. Start small, preview outcomes, then commit when the signal is right.",
  },
  {
    icon: TrendingUp,
    title: "Commercial context",
    description:
      "Every recommendation ties back to pricing, buyer urgency, route to market, or risk reduction.",
  },
  {
    icon: BadgeCheck,
    title: "Verified analysts",
    description:
      "Expert profiles include specialty, response time, rating, and matching context for custom work.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <span className="eyebrow">What changes</span>
            <h2 className="mt-4 text-5xl md:text-6xl">Research that behaves like a workflow.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8">
            The redesign makes Marketrix feel like a working product: searchable reports,
            guided intake, persistent demo briefs, and a dashboard that reacts to what users do.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="min-h-[238px] bg-white/82 p-7 transition-colors hover:bg-[var(--teal-soft)]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--paper)] text-[var(--teal)]">
                  <Icon size={22} />
                </div>
                <h3 className="font-sans text-xl font-extrabold leading-7">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
