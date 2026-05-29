"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  CalendarClock,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";
import { analysts, demoBriefs, reports, type Brief } from "@/lib/market-data";

const STORAGE_KEY = "marketrix_briefs";

function subscribeToBriefs(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("marketrix:briefs", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("marketrix:briefs", callback);
  };
}

function getBriefSnapshot() {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(STORAGE_KEY) || "[]";
}

export default function Dashboard() {
  const [contacted, setContacted] = useState<string[]>([]);
  const briefSnapshot = useSyncExternalStore(subscribeToBriefs, getBriefSnapshot, () => "[]");

  const savedBriefs = useMemo(() => JSON.parse(briefSnapshot) as Brief[], [briefSnapshot]);
  const briefs = useMemo(() => [...savedBriefs, ...demoBriefs].slice(0, 5), [savedBriefs]);

  const stats = [
    { label: "Active briefs", value: briefs.length.toString(), icon: FileText },
    { label: "Saved research", value: "12", icon: Bookmark },
    { label: "Analyst messages", value: contacted.length.toString(), icon: MessageSquare },
    { label: "Avg match", value: "94%", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen pb-20">
      <section className="border-b border-[var(--line)] bg-white/62 py-12">
        <div className="container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1 className="mt-4 text-6xl md:text-7xl">Research workbench</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8">
              Active briefs, recommended reports, and analyst follow-ups in one operating view.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/marketplace" className="btn-secondary">
              Browse reports
            </Link>
            <Link href="/submit-brief" className="btn-primary">
              New brief
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/82 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <p className="mono text-xs font-semibold uppercase">{stat.label}</p>
                  <Icon size={20} className="text-[var(--teal)]" />
                </div>
                <div className="display text-5xl">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-6">
          <div className="surface p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Brief queue</span>
                <h2 className="mt-2 font-sans text-2xl font-black">Active intelligence requests</h2>
              </div>
              <Link href="/submit-brief" className="btn-secondary">
                Add
              </Link>
            </div>
            <div className="grid gap-3">
              {briefs.map((brief) => (
                <article key={brief.id} className="quiet-surface p-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="tag tag-teal">{brief.status}</span>
                        <span className="tag">{brief.industry}</span>
                        <span className="tag">{brief.stage}</span>
                      </div>
                      <h3 className="font-sans text-xl font-extrabold">{brief.name}</h3>
                      <p className="mt-2 text-sm">
                        {brief.goals.slice(0, 2).join(" / ") || "Goals pending"}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="mono text-xs font-semibold uppercase">{brief.id}</p>
                      <p className="mt-2 flex items-center gap-2 text-sm md:justify-end">
                        <CalendarClock size={15} />
                        {brief.createdAt}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="surface p-6">
            <div className="mb-6">
              <span className="eyebrow">Recommendations</span>
              <h2 className="mt-2 font-sans text-2xl font-black">Best next reports</h2>
            </div>
            <div className="grid gap-3">
              {reports.slice(0, 4).map((report) => (
                <article key={report.id} className="quiet-surface p-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <h3 className="font-sans text-lg font-extrabold">{report.title}</h3>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--line)]">
                        <div className="h-full rounded-full bg-[var(--teal)]" style={{ width: `${report.match}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-5 md:block md:text-right">
                      <p className="font-black">{report.match}% match</p>
                      <Link href="/marketplace" className="mt-0 inline-flex text-sm font-extrabold text-[var(--teal)] md:mt-2">
                        Preview
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
          <div className="surface p-6">
            <span className="eyebrow">Analysts</span>
            <h2 className="mt-2 font-sans text-2xl font-black">Ready to brief</h2>
            <div className="mt-6 grid gap-3">
              {analysts.map((analyst) => {
                const isContacted = contacted.includes(analyst.name);
                return (
                  <article key={analyst.name} className="quiet-surface p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-sans text-base font-extrabold">{analyst.name}</h3>
                        <p className="mt-1 text-sm">{analyst.specialty}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <Star size={14} fill="var(--gold)" className="text-[var(--gold)]" />
                          {analyst.rating} rating / {analyst.responseTime} response
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          setContacted((current) =>
                            current.includes(analyst.name)
                              ? current.filter((item) => item !== analyst.name)
                              : [...current, analyst.name]
                          )
                        }
                      >
                        {isContacted ? "Queued" : "Brief"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--rust-soft)] p-6 rounded-lg border border-[rgba(196,73,45,0.24)]">
            <span className="eyebrow">Desk note</span>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
              Submitted briefs from the form are saved locally when the backend is unavailable,
              so the demo remains usable during frontend work.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
