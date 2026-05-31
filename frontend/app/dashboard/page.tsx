"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  CalendarClock,
  FileText,
  Loader2,
  MessageSquare,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { getMyBriefs, getRecommendations, getToken, type BriefResponse, type RecommendationResponse } from "@/lib/api";
import { analysts } from "@/lib/market-data";

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "var(--gold)",
  PROCESSING: "var(--coral)",
  COMPLETE: "var(--emerald)",
  FAILED: "var(--coral)",
};

export default function Dashboard() {
  const [briefs, setBriefs] = useState<BriefResponse[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacted, setContacted] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMyBriefs();
        setBriefs(data);

        // Fetch recommendations for the first COMPLETE brief
        const completeBrief = data.find((b) => b.status === "COMPLETE");
        if (completeBrief) {
          const recs = await getRecommendations(completeBrief.id);
          setRecommendations(recs);
        }
      } catch {
        setBriefs([]);
      } finally {
        setLoading(false);
      }
    }

    if (getToken()) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const stats = [
    { label: "Active briefs", value: briefs.length.toString(), icon: FileText, color: "var(--emerald)" },
    { label: "Saved research", value: "0", icon: Bookmark, color: "var(--gold)" },
    { label: "Analyst messages", value: contacted.length.toString(), icon: MessageSquare, color: "var(--coral)" },
    { label: "Avg match", value: "—", icon: BarChart3, color: "var(--emerald)" },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg-base)" }}>

      {/* Page header */}
      <section className="border-b border-[var(--line)] relative overflow-hidden" style={{ background: "var(--bg-raised)" }}>
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full blur-3xl opacity-[0.05] pointer-events-none"
          style={{ background: "var(--emerald)", transform: "translate(25%, -25%)" }} />
        <div className="container relative z-10 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Dashboard</span>
              <h1 className="mt-5 text-[2.8rem] leading-[1.04] md:text-[3.8rem]">
                Research{" "}
                <span className="gradient-text">workbench</span>
              </h1>
              <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-[var(--ink-soft)]">
                Active briefs, recommended reports, and analyst follow-ups in one operating view.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/marketplace" className="btn-secondary">
                Browse reports
              </Link>
              <Link href="/submit-brief" className="btn-primary">
                New brief
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-5 transition-all hover:border-[var(--line-medium)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="mono text-[0.62rem] font-medium uppercase tracking-widest text-[var(--ink-muted)]">
                    {stat.label}
                  </p>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: `${stat.color}10`, color: stat.color }}
                  >
                    <Icon size={16} />
                  </div>
                </div>
                <div className="display text-4xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main content */}
      <section className="container grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6 h-fit">
          {/* Brief queue */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <span className="eyebrow text-xs">Brief queue</span>
                <h2 className="mt-2 font-sans text-xl font-semibold text-[var(--ink)]">
                  Active intelligence requests
                </h2>
              </div>
              <Link href="/submit-brief" className="btn-secondary text-sm">
                + Add
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-[var(--ink-muted)]" />
              </div>
            ) : briefs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--line)] p-8 text-center">
                <FileText size={32} className="mx-auto mb-3 text-[var(--ink-muted)]" />
                <p className="text-sm text-[var(--ink-soft)]">
                  {getToken() ? "No briefs yet. Submit your first brief to get started." : "Log in to see your briefs."}
                </p>
                <Link href="/submit-brief" className="btn-primary mt-4 inline-flex">
                  Submit a brief
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid gap-3">
                {briefs.map((brief) => {
                  const statusColor = STATUS_COLORS[brief.status] ?? "var(--ink-muted)";
                  return (
                    <Link
                      href={`/dashboard/${brief.id}`}
                      key={brief.id}
                      className="block rounded-lg border border-[var(--line)] bg-[var(--bg-surface)] p-4 transition-all hover:border-[var(--line-medium)] hover:-translate-y-0.5"
                    >
                      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                              className="tag"
                              style={{
                                borderColor: `${statusColor}25`,
                                background: `${statusColor}10`,
                                color: statusColor,
                              }}
                            >
                              {brief.status}
                            </span>
                            <span className="tag">{brief.industry}</span>
                            <span className="tag">{brief.stage}</span>
                          </div>
                          <h3 className="font-sans font-semibold text-[var(--ink)]">{brief.name}</h3>
                          <p className="mt-1.5 text-sm text-[var(--ink-soft)]">
                            {brief.goals?.slice(0, 2).join(" · ") || "Goals pending"}
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="mono text-[0.62rem] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                            {brief.id.slice(0, 8)}
                          </p>
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--ink-muted)] md:justify-end">
                            <CalendarClock size={13} />
                            {new Date(brief.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-6">
              <div className="mb-6">
                <span className="eyebrow text-xs">AI Recommendations</span>
                <h2 className="mt-2 font-sans text-xl font-semibold text-[var(--ink)]">
                  Matched for your brief
                </h2>
              </div>
              <div className="grid gap-3">
                {recommendations.slice(0, 5).map((rec) => (
                  <article
                    key={rec.id}
                    className="rounded-lg border border-[var(--line)] bg-[var(--bg-surface)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="tag tag-emerald">{rec.type}</span>
                          <span className="mono text-xs font-semibold" style={{ color: "var(--emerald)" }}>
                            {Math.round((rec.score ?? 0) * 100)}%
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                          {rec.explanation}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
          {/* Analysts */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-6">
            <div className="mb-5">
              <span className="eyebrow text-xs">Analysts</span>
              <h2 className="mt-2 font-sans text-xl font-semibold text-[var(--ink)]">
                Ready to brief
              </h2>
            </div>
            <div className="grid gap-3">
              {analysts.map((analyst) => {
                const isContacted = contacted.includes(analyst.name);
                const initials = analyst.name.split(" ").map((p) => p[0]).join("");
                return (
                  <article
                    key={analyst.name}
                    className="rounded-lg border border-[var(--line)] bg-[var(--bg-surface)] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="mono flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          background: "var(--emerald-surface)",
                          color: "var(--emerald)",
                          border: "1px solid var(--emerald-border)",
                        }}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[var(--ink)] truncate">{analyst.name}</h3>
                        <p className="text-xs text-[var(--ink-muted)] truncate">{analyst.specialty}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Star size={11} fill="var(--gold)" className="text-[var(--gold)]" />
                          <span className="text-xs text-[var(--ink-soft)]">
                            {analyst.rating} · {analyst.responseTime}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`btn-secondary text-xs shrink-0 ${
                          isContacted ? "border-[var(--emerald-border)] bg-[var(--emerald-surface)] text-[var(--emerald)]" : ""
                        }`}
                        style={{ minHeight: "34px", padding: "0 12px" }}
                        onClick={() =>
                          setContacted((current) =>
                            current.includes(analyst.name)
                              ? current.filter((item) => item !== analyst.name)
                              : [...current, analyst.name]
                          )
                        }
                      >
                        {isContacted ? (
                          <>
                            <Zap size={12} />
                            Queued
                          </>
                        ) : "Brief"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div
            className="rounded-xl border border-[var(--emerald-border)] p-6"
            style={{ background: "var(--emerald-surface)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color: "var(--emerald)" }} />
              <span className="mono text-[0.65rem] font-medium uppercase tracking-widest" style={{ color: "var(--emerald)" }}>
                Connected
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
              This dashboard fetches your briefs from the Marketrix backend API.
              Submit a brief to see it appear here in real time.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
