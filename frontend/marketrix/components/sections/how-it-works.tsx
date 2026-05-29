"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Submit Your Brief",
      description: "Tell us about your market, audience, and research goals in a simple form.",
      icon: "📝",
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our system extracts key insights and matches you to relevant research and experts.",
      icon: "🤖",
    },
    {
      step: 3,
      title: "Get Recommendations",
      description: "Receive curated reports, analyst profiles, and custom research opportunities.",
      icon: "📊",
    },
    {
      step: 4,
      title: "Take Action",
      description: "Purchase research, hire analysts, or book consultations—all in one place.",
      icon: "✅",
    },
  ];

  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            How <span className="gradient-text">Marketrix</span> Works
          </h2>
          <p className="text-lg text-slate-300">
            Four simple steps from market question to market intelligence.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-violet-600/20 to-transparent hidden md:block"></div>

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.step} className="relative animate-float-in" style={{animationDelay: `${index * 150}ms`}}>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Content (alternates) */}
                    <div className={index % 2 === 0 ? "order-1" : "order-2 md:order-2"}>
                      <div className="card-minimal">
                        <div className="flex items-start gap-4">
                          {/* Icon Circle */}
                          <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-2xl flex-shrink-0">
                            {step.icon}
                          </div>

                          {/* Content */}
                          <div>
                            <h3 className="text-2xl md:text-xl font-semibold text-white mb-2">
                              {step.title}
                            </h3>
                            <p className="text-slate-400">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step Number Circle */}
                    <div className={`hidden md:flex justify-center order-2 ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}>
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border-2 border-violet-600/50 flex items-center justify-center">
                          <span className="text-3xl font-display font-bold gradient-text">
                            {step.step}
                          </span>
                        </div>

                        {/* Connector Arrow */}
                        {step.step < 4 && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2">
                            <ArrowRight className="w-6 h-6 text-violet-600/50 transform rotate-90" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <button className="btn-primary">
            Start Your Research Now
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
