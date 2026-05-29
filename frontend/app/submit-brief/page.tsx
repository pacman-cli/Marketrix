"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Clock, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { submitStartupBrief } from "@/lib/api";
import type { Brief } from "@/lib/market-data";

const STORAGE_KEY = "marketrix_briefs";

const stages = ["Idea", "Pre-seed", "Seed", "Series A", "Series B+", "Corporate"];
const industries = ["SaaS", "Healthcare", "FinTech", "Consumer", "EdTech", "AI", "Other"];
const budgets = ["Under $500", "$500 - $1,000", "$1,000 - $5,000", "$5,000+"];
const timelines = ["48 hours", "This week", "This month", "Flexible"];

function listFromText(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function saveBrief(brief: Brief) {
  if (typeof window === "undefined") return;
  const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as Brief[];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([brief, ...existing].slice(0, 8)));
  window.dispatchEvent(new Event("marketrix:briefs"));
}

export default function SubmitBriefPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
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

  const goals = useMemo(() => listFromText(formData.goals), [formData.goals]);
  const challenges = useMemo(() => listFromText(formData.challenges), [formData.challenges]);

  const stepReady =
    (step === 1 && formData.companyName && formData.industry && formData.stage && formData.targetMarket) ||
    (step === 2 && goals.length > 0 && challenges.length > 0) ||
    (step === 3 && formData.budget && formData.timeline);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setNotice("");
  };

  const persistDemoBrief = (status: string) => {
    const brief: Brief = {
      id: `MX-${Date.now().toString().slice(-5)}`,
      name: formData.companyName,
      industry: formData.industry,
      stage: formData.stage,
      budget: formData.budget,
      status,
      createdAt: "Just now",
      goals,
    };
    saveBrief(brief);
    return brief;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stepReady) {
      setNotice("Complete the required fields in this step to continue.");
      return;
    }

    if (step < 3) {
      setStep((value) => value + 1);
      return;
    }

    setIsSubmitting(true);
    setNotice("");

    try {
      await submitStartupBrief({
        name: formData.companyName,
        industry: formData.industry,
        stage: formData.stage,
        geography: formData.targetMarket,
        budget: formData.budget,
        goals,
        problems: challenges,
      });
      persistDemoBrief("Submitted");
      setNotice("Brief submitted and added to your dashboard.");
    } catch {
      persistDemoBrief("Saved locally");
      setNotice("Backend is unavailable, so the brief was saved locally for the demo dashboard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <section className="border-b border-[var(--line)] bg-white/62 py-16">
        <div className="container grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <span className="eyebrow">Research brief</span>
            <h1 className="mt-4 text-6xl md:text-7xl">Give the research desk a clean signal.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8">
              A guided intake keeps the marketplace useful: fewer vague requests, better
              analyst matches, and clearer report recommendations.
            </p>
          </div>
          <div className="quiet-surface p-5">
            <div className="grid gap-4">
              {[
                { icon: FileText, label: "Structured intake" },
                { icon: Sparkles, label: "AI-ready matching data" },
                { icon: ShieldCheck, label: "Local demo fallback" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 text-sm font-extrabold">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--teal-soft)] text-[var(--teal)]">
                      <Icon size={18} />
                    </span>
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="surface h-fit p-5 lg:sticky lg:top-24">
          <div className="grid gap-3">
            {[
              ["01", "Company context"],
              ["02", "Research goals"],
              ["03", "Budget and timing"],
            ].map(([number, label], index) => {
              const current = index + 1;
              return (
                <button
                  key={number}
                  type="button"
                  className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left ${
                    step === current
                      ? "border-[var(--teal)] bg-[var(--teal-soft)]"
                      : "border-[var(--line)] bg-white/70"
                  }`}
                  onClick={() => setStep(current)}
                >
                  <span className="mono text-xs font-semibold">{number}</span>
                  <span className="text-sm font-extrabold">{label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="surface p-5 md:p-8">
          {step === 1 && (
            <div className="grid gap-6">
              <div>
                <span className="eyebrow">Step 01</span>
                <h2 className="mt-3 text-5xl">Company context</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold">Company name</span>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="input-base"
                    placeholder="Northstar AI"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold">Target market</span>
                  <input
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleInputChange}
                    className="input-base"
                    placeholder="US enterprise finance teams"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold">Industry</span>
                  <select name="industry" value={formData.industry} onChange={handleInputChange} className="select-base">
                    <option value="">Select industry</option>
                    {industries.map((industry) => (
                      <option key={industry}>{industry}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold">Stage</span>
                  <select name="stage" value={formData.stage} onChange={handleInputChange} className="select-base">
                    <option value="">Select stage</option>
                    {stages.map((stage) => (
                      <option key={stage}>{stage}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <div>
                <span className="eyebrow">Step 02</span>
                <h2 className="mt-3 text-5xl">Research goals</h2>
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold">What should this research answer?</span>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  className="textarea-base"
                  placeholder="Rank the best wedge markets, benchmark pricing, validate budget owner"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold">Known risks or open questions</span>
                <textarea
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleInputChange}
                  className="textarea-base"
                  placeholder="Competitor noise, uncertain buyer urgency, unclear procurement path"
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6">
              <div>
                <span className="eyebrow">Step 03</span>
                <h2 className="mt-3 text-5xl">Budget and timing</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold">Budget</span>
                  <select name="budget" value={formData.budget} onChange={handleInputChange} className="select-base">
                    <option value="">Select budget</option>
                    {budgets.map((budgetOption) => (
                      <option key={budgetOption}>{budgetOption}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold">Timeline</span>
                  <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="select-base">
                    <option value="">Select timeline</option>
                    {timelines.map((timeline) => (
                      <option key={timeline}>{timeline}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="quiet-surface grid gap-4 p-5 md:grid-cols-3">
                {[
                  ["Goals", goals.length || 0],
                  ["Risks", challenges.length || 0],
                  ["ETA", formData.timeline || "Pending"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="mono text-xs font-semibold uppercase">{label}</p>
                    <p className="mt-1 font-extrabold text-[var(--ink)]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notice && (
            <div className="mt-8 flex items-start gap-3 rounded-lg border border-[var(--teal)] bg-[var(--teal-soft)] p-4 text-sm font-bold text-[var(--teal-dark)]">
              <Clock size={18} className="mt-0.5" />
              {notice}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row">
            {step > 1 && (
              <button type="button" className="btn-secondary flex-1" onClick={() => setStep((value) => value - 1)}>
                Back
              </button>
            )}
            <button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
              {step === 3 ? (isSubmitting ? "Submitting..." : "Submit brief") : "Continue"}
              {step === 3 ? <Check size={18} /> : <ArrowRight size={18} />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
