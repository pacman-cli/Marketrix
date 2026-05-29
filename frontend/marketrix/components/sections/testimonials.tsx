"use client";

import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Marketrix cut our research timeline from 3 months to 2 weeks. The AI matching was eerily accurate—every recommendation was relevant.",
      author: "Sarah Chen",
      role: "Founder, TechFlow",
      avatar: "SC",
      rating: 5,
    },
    {
      quote:
        "As an analyst, I went from unpaid research sitting in a folder to earning $40K/year selling insights. The platform works.",
      author: "James Rodriguez",
      role: "Market Researcher",
      avatar: "JR",
      rating: 5,
    },
    {
      quote:
        "The precision of their recommendations saved us thousands in wasted research spend. Best platform for market intelligence I've used.",
      author: "Emily Watson",
      role: "Founder, GrowthCo",
      avatar: "EW",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Trusted by founders and <span className="gradient-text">market experts</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="card-minimal group"
              style={{
                animation: `float-in 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0,
              }}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-violet-500/50" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-lg text-slate-200 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
