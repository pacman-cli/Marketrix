"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-cyan-600/10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center glass-dark p-12 md:p-20 rounded-3xl border border-white/20 animate-fade-in">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="badge-success">Ready to Get Started?</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Find Your Market Edge
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Thousands of founders and analysts have transformed their market research with Marketrix.
            Join them today and get matched to breakthrough intelligence in minutes.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit-brief" className="btn-primary group text-lg px-8 py-4">
              Start Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/marketplace" className="btn-secondary text-lg px-8 py-4">
              Browse Research
            </Link>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-slate-400 mt-10">
            🎁 New founders get 50% off their first research purchase
          </p>
        </div>
      </div>
    </section>
  );
}
