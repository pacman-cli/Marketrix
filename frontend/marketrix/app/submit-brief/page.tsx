"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { submitStartupBrief } from "@/lib/api";

export default function SubmitBriefPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    stage: "",
    targetMarket: "",
    budget: "",
    timeline: "",
    goals: "",
    challenges: "",
  });

  const listFromText = (value: string) =>
    value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
    setSubmitMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitMessage("");

      try {
        await submitStartupBrief({
          name: formData.companyName,
          industry: formData.industry,
          stage: formData.stage,
          geography: formData.targetMarket,
          budget: formData.budget,
          goals: listFromText(formData.goals),
          problems: listFromText(formData.challenges),
        });
        setSubmitMessage("Brief submitted successfully.");
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Unable to submit brief."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="py-12 border-b border-white/10 glass-dark">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            Submit Your Research Brief
          </h1>
          <p className="text-lg text-slate-300">
            Get AI-matched to expert research and analysts in minutes
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s <= step
                        ? "bg-violet-600 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {s < step ? <Check size={20} /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        s < step ? "bg-violet-600" : "bg-slate-800"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm">
              <span className={step >= 1 ? "text-white" : "text-slate-400"}>
                About Your Company
              </span>
              <span className={step >= 2 ? "text-white" : "text-slate-400"}>
                Your Research Goals
              </span>
              <span className={step >= 3 ? "text-white" : "text-slate-400"}>
                Budget & Timeline
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card-minimal">
            {step === 1 && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-display font-bold mb-8">
                  About Your Company
                </h2>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    className="input-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="input-base"
                    >
                      <option value="">Select an industry</option>
                      <option value="saas">SaaS</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="fintech">FinTech</option>
                      <option value="edtech">EdTech</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Company Stage
                    </label>
                    <select
                      name="stage"
                      value={formData.stage}
                      onChange={handleInputChange}
                      className="input-base"
                    >
                      <option value="">Select stage</option>
                      <option value="idea">Idea</option>
                      <option value="seed">Seed</option>
                      <option value="series-a">Series A</option>
                      <option value="series-b">Series B+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Target Market / Geography
                  </label>
                  <input
                    type="text"
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleInputChange}
                    placeholder="e.g., North America, B2B, Enterprise"
                    className="input-base"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-display font-bold mb-8">
                  Your Research Goals
                </h2>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    What are your primary research goals?
                  </label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    placeholder="Tell us what you're trying to understand..."
                    className="textarea-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Key Challenges or Questions
                  </label>
                  <textarea
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleInputChange}
                    placeholder="What specific questions need answering?"
                    className="textarea-base"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-display font-bold mb-8">
                  Budget & Timeline
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Research Budget
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="input-base"
                    >
                      <option value="">Select budget range</option>
                      <option value="0-500">$0 - $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000+">$5,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      When Do You Need This?
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="input-base"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP (within 2 days)</option>
                      <option value="week">This week</option>
                      <option value="month">This month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                {/* Summary */}
                <div className="card-minimal bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border-violet-600/30 mt-8">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles size={20} />
                    What Happens Next
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li>✓ Submit your brief</li>
                    <li>✓ Our AI analyzes your requirements</li>
                    <li>✓ Receive matched research & analyst recommendations</li>
                    <li>✓ Connect directly to top matches</li>
                    <li>✓ Get intelligence in under 10 minutes</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            {(submitError || submitMessage) && (
              <div
                className={`mt-8 rounded-lg border px-4 py-3 text-sm ${
                  submitError
                    ? "border-red-500/40 bg-red-500/10 text-red-200"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                {submitError || submitMessage}
              </div>
            )}

            <div className="flex gap-4 mt-10 pt-6 border-t border-white/10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 group disabled:cursor-not-allowed disabled:opacity-60"
              >
                {step === 3 ? (isSubmitting ? "Submitting..." : "Submit Brief") : "Next"}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
