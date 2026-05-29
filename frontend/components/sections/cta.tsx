"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function CTA() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--teal-soft)] py-16">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="eyebrow">Ready desk</span>
            <h2 className="mt-4 text-5xl md:text-6xl">Turn the next question into a brief.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8">
              Start with a structured intake, browse the report inventory, or open the
              dashboard to see how active research work is organized.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link href="/submit-brief" className="btn-primary">
              Start a brief
              <ArrowRight size={18} />
            </Link>
            <Link href="/marketplace" className="btn-secondary">
              <Search size={18} />
              Browse research
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
