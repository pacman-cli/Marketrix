"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, CircleDollarSign, Clock, Loader2, Plus, Search } from "lucide-react";
import { getGigs, createGig, getToken, type GigResponse } from "@/lib/api";
import { useToast } from "@/components/toast";
import AuthGuard from "@/components/auth-guard";

export default function GigsPage() {
  const [gigs, setGigs] = useState<GigResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [query, setQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getGigs(0, 50);
        setGigs(data.content || []);
      } catch {
        toast.error("Could not load gigs");
      } finally {
        setLoading(false);
      }
    }
    if (getToken()) fetch();
    else setLoading(false);
  }, []);

  const filtered = gigs.filter(
    (g) => !query || [g.title, g.description, ...g.requirements].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AuthGuard>
    <div className="min-h-screen pb-20" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <section className="border-b border-[var(--line)] relative overflow-hidden" style={{ background: "var(--bg-raised)" }}>
        <div className="container relative z-10 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Gig marketplace</span>
              <h1 className="mt-5 text-[2.8rem] leading-[1.04] md:text-[3.8rem]">
                Find <span className="gradient-text">expert work</span>
              </h1>
              <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-[var(--ink-soft)]">
                Founders post research gigs. Analysts apply with proposals. AI matches the best fit.
              </p>
            </div>
            <button type="button" onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus size={16} />
              Post a gig
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="container py-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--ink-muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gigs..."
            className="input-base input-icon"
          />
        </div>
      </section>

      {/* Gig list */}
      <section className="container">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[var(--ink-muted)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center">
            <Briefcase size={36} className="mx-auto mb-4 text-[var(--ink-muted)]" />
            <h2 className="text-xl font-semibold text-[var(--ink)]">No gigs yet</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">Be the first to post a research gig.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((gig) => (
              <article key={gig.id} className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-6 transition-all hover:border-[var(--line-medium)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="tag tag-emerald">{gig.status}</span>
                      {gig.requirements?.slice(0, 3).map((r) => (
                        <span key={r} className="tag">{r}</span>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--ink)]">{gig.title}</h3>
                    <p className="mt-2 text-sm text-[var(--ink-soft)] line-clamp-2">{gig.description}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <CircleDollarSign size={16} style={{ color: "var(--emerald)" }} />
                      <span className="text-lg font-bold text-[var(--ink)]">${gig.budget}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
                      <Clock size={13} />
                      {new Date(gig.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Create gig modal */}
      {showCreate && <CreateGigModal onClose={() => setShowCreate(false)} onCreated={(g) => { setGigs([g, ...gigs]); setShowCreate(false); toast.success("Gig posted!"); }} />}
    </div>
    </AuthGuard>
  );
}

function CreateGigModal({ onClose, onCreated }: { onClose: () => void; onCreated: (g: GigResponse) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [requirements, setRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const gig = await createGig(title, description, Number(budget), requirements.split(",").map((s) => s.trim()).filter(Boolean));
      onCreated(gig);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create gig");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-6">
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-6">Post a research gig</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1.5">Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Market sizing for EV charging in SEA" className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1.5">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What do you need researched?" className="input-base" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1.5">Budget ($)</label>
              <input required type="number" min="1" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="500" className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1.5">Skills (comma-separated)</label>
              <input value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="SaaS, pricing, GTM" className="input-base" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Post gig</>}
          </button>
        </div>
      </form>
    </div>
  );
}
