"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Loader2,
  MapPin,
  Megaphone,
  Target,
  ThumbsDown,
  ThumbsUp,
  Users,
  Zap,
} from "lucide-react";
import {
  getSegments,
  getRecommendations,
  rateSegment,
  type SegmentResponse,
  type RecommendationResponse,
} from "@/lib/api";
import AuthGuard from "@/components/auth-guard";
import { useToast } from "@/components/toast";

export default function BriefDetailPage() {
  const params = useParams();
  const briefId = params.briefId as string;
  const toast = useToast();

  const [segments, setSegments] = useState<SegmentResponse[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [rated, setRated] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [segs, recs] = await Promise.all([
          getSegments(briefId),
          getRecommendations(briefId),
        ]);
        setSegments(segs);
        setRecommendations(recs);
      } catch {
        toast.error("Could not load analysis results");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [briefId]);

  const handleRate = async (segmentId: string, signal: "THUMBS_UP" | "THUMBS_DOWN") => {
    try {
      await rateSegment(segmentId, signal);
      setRated((prev) => ({ ...prev, [segmentId]: signal }));
      toast.success(signal === "THUMBS_UP" ? "Marked as relevant" : "Marked as not relevant");
    } catch {
      toast.error("Could not submit rating");
    }
  };

  const channelRecs = recommendations.filter((r) => r.type === "CHANNEL");
  const positioningRecs = recommendations.filter((r) => r.type === "POSITIONING");
  const strategistRecs = recommendations.filter((r) => r.type === "STRATEGIST");

  return (
    <AuthGuard>
      <div className="min-h-screen pb-20" style={{ background: "var(--bg-base)" }}>
        {/* Header */}
        <section className="border-b border-[var(--line)]" style={{ background: "var(--bg-raised)" }}>
          <div className="container py-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] mb-6">
              <ArrowLeft size={14} /> Back to dashboard
            </Link>
            <h1 className="text-[2.5rem] leading-[1.08] md:text-[3.2rem]">
              Audience <span className="gradient-text">Intelligence</span>
            </h1>
            <p className="mt-3 text-[var(--ink-soft)]">AI-generated segments, channel strategy, and positioning for your brief.</p>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[var(--ink-muted)]" />
          </div>
        ) : (
          <div className="container py-8 grid gap-8">
            {/* Segments */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Users size={18} style={{ color: "var(--emerald)" }} />
                <h2 className="text-xl font-semibold text-[var(--ink)]">Audience Segments</h2>
                <span className="tag tag-emerald">{segments.length}</span>
              </div>

              {segments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--line)] p-8 text-center">
                  <p className="text-sm text-[var(--ink-soft)]">No segments generated yet. The AI pipeline may still be processing.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {segments.map((seg) => (
                    <article key={seg.id} className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-5 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[var(--ink)]">{seg.name}</h3>
                          <p className="text-xs text-[var(--ink-soft)] mt-1">{seg.tagline}</p>
                        </div>
                        <span className="mono text-xs font-bold" style={{ color: "var(--emerald)" }}>
                          {Math.round(seg.viabilityScore * 100)}%
                        </span>
                      </div>

                      {/* Demographics */}
                      <div className="mb-3">
                        <p className="mono text-[0.6rem] uppercase tracking-widest text-[var(--ink-muted)] mb-1">Demographics</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(seg.demographics || {}).map(([k, v]) => (
                            <span key={k} className="tag text-[0.65rem]">{String(v)}</span>
                          ))}
                        </div>
                      </div>

                      {/* Channels */}
                      <div className="mb-3">
                        <p className="mono text-[0.6rem] uppercase tracking-widest text-[var(--ink-muted)] mb-1">Channels</p>
                        <div className="flex flex-wrap gap-1">
                          {(seg.preferredChannels || []).slice(0, 4).map((ch) => (
                            <span key={ch} className="tag tag-emerald text-[0.65rem]">{ch}</span>
                          ))}
                        </div>
                      </div>

                      {/* Rationale */}
                      <p className="text-xs text-[var(--ink-soft)] leading-relaxed flex-1">{seg.rationale}</p>

                      {/* Rating */}
                      <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center gap-2">
                        <span className="text-xs text-[var(--ink-muted)] flex-1">Is this relevant?</span>
                        <button
                          type="button"
                          onClick={() => handleRate(seg.id, "THUMBS_UP")}
                          className={`p-1.5 rounded-md transition-all ${rated[seg.id] === "THUMBS_UP" ? "bg-[var(--emerald-surface)] text-[var(--emerald)]" : "text-[var(--ink-muted)] hover:text-[var(--emerald)]"}`}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRate(seg.id, "THUMBS_DOWN")}
                          className={`p-1.5 rounded-md transition-all ${rated[seg.id] === "THUMBS_DOWN" ? "bg-red-500/10 text-red-400" : "text-[var(--ink-muted)] hover:text-red-400"}`}
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Channel Recommendations */}
            {channelRecs.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone size={18} style={{ color: "var(--gold)" }} />
                  <h2 className="text-xl font-semibold text-[var(--ink)]">Channel Strategy</h2>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-5">
                  {channelRecs.map((rec) => (
                    <div key={rec.id} className="text-sm text-[var(--ink-soft)] leading-relaxed">
                      {rec.explanation?.length > 200 ? (
                        <pre className="whitespace-pre-wrap font-sans text-xs">{rec.explanation}</pre>
                      ) : (
                        <p>{rec.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Positioning */}
            {positioningRecs.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} style={{ color: "var(--coral)" }} />
                  <h2 className="text-xl font-semibold text-[var(--ink)]">Positioning Analysis</h2>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-5">
                  {positioningRecs.map((rec) => (
                    <div key={rec.id} className="text-sm text-[var(--ink-soft)] leading-relaxed">
                      <pre className="whitespace-pre-wrap font-sans text-xs">{rec.explanation}</pre>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Strategist Matches */}
            {strategistRecs.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={18} style={{ color: "var(--emerald)" }} />
                  <h2 className="text-xl font-semibold text-[var(--ink)]">Matched Strategists</h2>
                  <span className="tag">{strategistRecs.length} matches</span>
                </div>
                <div className="grid gap-3">
                  {strategistRecs.slice(0, 5).map((rec) => (
                    <div key={rec.id} className="rounded-lg border border-[var(--line)] bg-[var(--bg-surface)] p-4 flex items-center justify-between">
                      <p className="text-sm text-[var(--ink-soft)]">{rec.explanation}</p>
                      <span className="mono text-xs font-bold" style={{ color: "var(--emerald)" }}>
                        {Math.round((rec.score || 0) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
