"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Marketrix replaced three scattered spreadsheets with one clear research queue. We knew what to buy, what to ignore, and who to call next.",
    author: "Sarah Chen",
    role: "Founder, TechFlow",
    metric: "42 days saved",
  },
  {
    quote:
      "As an analyst, the marketplace gave my work a commercial home. The briefs are specific, which means the projects are better from day one.",
    author: "James Rodriguez",
    role: "Independent researcher",
    metric: "$40K annualized",
  },
  {
    quote:
      "The preview format helped our board understand the evidence behind every recommendation before we spent a dollar.",
    author: "Emily Watson",
    role: "CEO, GrowthCo",
    metric: "3 markets ranked",
  },
];

export default function Testimonials() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Proof points</span>
          <h2 className="mt-4 text-5xl md:text-6xl">A sharper way to buy market clarity.</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.author} className="quiet-surface p-7">
              <div className="mb-8 flex items-center justify-between">
                <Quote className="text-[var(--teal)]" size={24} />
                <div className="flex gap-1 text-[var(--gold)]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="min-h-[140px] text-base leading-8 text-[var(--ink-soft)]">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-8 border-t border-[var(--line)] pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-base font-extrabold">{testimonial.author}</h3>
                    <p className="mt-1 text-sm">{testimonial.role}</p>
                  </div>
                  <span className="tag tag-gold">{testimonial.metric}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
