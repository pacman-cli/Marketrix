"use client";

import { Zap, BarChart3, Users, Sparkles, Rocket, Target } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Matching",
      description: "Advanced algorithms connect you to perfectly-matched research and analysts in seconds.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Live dashboards track recommendation performance and market trends as they evolve.",
    },
    {
      icon: Users,
      title: "Expert Community",
      description: "Access 850+ verified analysts, researchers, and market intelligence professionals.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "From brief submission to research delivery in under 10 minutes—no waiting.",
    },
    {
      icon: Rocket,
      title: "Launch Ready",
      description: "Actionable insights ready for board presentations and investor pitches.",
    },
    {
      icon: Target,
      title: "Precision Pricing",
      description: "Pay only for what you need. No enterprise minimums, no lock-in contracts.",
    },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Why founders choose <span className="gradient-text">Marketrix</span>
          </h2>
          <p className="text-lg text-slate-300">
            A complete solution for intelligence-driven decisions. Built by researchers, for researchers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-interactive group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "float-in 0.6s ease-out forwards",
                  opacity: 0,
                }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:from-violet-600/40 group-hover:to-cyan-600/40 transition-all">
                  <Icon className="w-6 h-6 text-violet-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Accent */}
                <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
