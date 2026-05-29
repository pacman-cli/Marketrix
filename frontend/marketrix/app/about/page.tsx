"use client";

import { ArrowRight, CheckCircle2, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="py-24 border-b border-white/10 glass-dark">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Built for <span className="gradient-text">breakthough thinking</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Marketrix connects founders with breakthrough market intelligence and
            researchers with global audiences. We're fixing the $80 billion market
            research industry by making it accessible, affordable, and human-centered.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Our Story</h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                In 2025, I watched a brilliant startup founder spend $30,000 on market
                research they barely used. At the same time, I knew an amazing researcher
                with 50+ unpublished reports gathering dust in folders.
              </p>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                That's when I realized the problem: Two groups who could directly solve
                each other's problems were completely disconnected. So we built Marketrix—a
                platform where intelligence meets opportunity.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Today, we're enabling thousands of founders to access research faster and
                more affordably, while helping analysts and researchers finally get paid for
                their expertise.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden glass">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center">
                <div className="text-center">
                  <Zap className="w-24 h-24 text-violet-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">Our Origin Story</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 border-b border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-16">
            Our Mission & Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: "🎯",
                title: "Accessibility",
                description:
                  "Market intelligence shouldn't cost $50K. We're democratizing access to institutional-grade research.",
              },
              {
                icon: "👥",
                title: "Transparency",
                description:
                  "No hidden fees, no lock-in contracts, no corporate nonsense. What you see is what you get.",
              },
              {
                icon: "🚀",
                title: "Impact",
                description:
                  "We measure success by the breakthroughs our users create. Your wins are our wins.",
              },
            ].map((value) => (
              <div key={value.title} className="card-minimal text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 border-b border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-16">
            The Team Behind Marketrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Alex Chen",
                role: "Founder & CEO",
                bio: "Former McKinsey analyst. Built 3 startups. Market research obsessive.",
                avatar: "AC",
              },
              {
                name: "Sarah Rodriguez",
                role: "VP Product",
                bio: "Product lead at Notion. UX-first thinker. Makes hard things simple.",
                avatar: "SR",
              },
              {
                name: "James Park",
                role: "VP Engineering",
                bio: "Ex-Google engineer. ML specialist. 15 years in data products.",
                avatar: "JP",
              },
              {
                name: "Emma Watson",
                role: "Head of Strategy",
                bio: "B2B SaaS expert. 10 years building communities. Growth hacker.",
                avatar: "EW",
              },
            ].map((member) => (
              <div key={member.name} className="card-minimal text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-violet-400 text-sm mb-2">{member.role}</p>
                <p className="text-slate-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-16">
            Why Teams Choose Marketrix
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              "AI-powered matching ensures 98%+ relevant recommendations",
              "Access to 2,400+ vetted reports across every industry",
              "Direct connection to 850+ expert analysts for custom work",
              "50-70% cost savings vs. traditional consulting",
              "Instant delivery—intelligence in under 10 minutes",
              "Transparent pricing with no hidden fees or minimums",
            ].map((reason, index) => (
              <div key={reason} className="flex items-start gap-4 card-minimal">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <span className="text-lg text-slate-200">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Join thousands finding their <span className="gradient-text">market edge</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Whether you're a founder seeking intelligence or an analyst monetizing expertise,
            Marketrix is your platform.
          </p>
          <button className="btn-primary group">
            Get Started
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
