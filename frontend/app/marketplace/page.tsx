"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  CircleDollarSign,
  Filter,
  Search,
  Star,
} from "lucide-react";
import { budgetOptions, categories, reports, type ResearchReport } from "@/lib/market-data";

const tierClass: Record<ResearchReport["tier"], string> = {
  Flagship: "tag-rust",
  Standard: "tag-teal",
  Starter: "tag-gold",
};

function inBudget(report: ResearchReport, budget: string) {
  if (budget === "Under $200") return report.price < 200;
  if (budget === "$200 - $300") return report.price >= 200 && report.price <= 300;
  if (budget === "$300+") return report.price > 300;
  return true;
}

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [budget, setBudget] = useState("Any budget");
  const [sort, setSort] = useState("Best match");
  const [visibleCount, setVisibleCount] = useState(6);
  const [previewId, setPreviewId] = useState(reports[0].id);
  const [shortlist, setShortlist] = useState<number[]>([]);

  const filteredReports = useMemo(() => {
    const value = query.trim().toLowerCase();
    const matches = reports.filter((report) => {
      const matchesQuery =
        !value ||
        [report.title, report.author, report.category, report.description, ...report.tags]
          .join(" ")
          .toLowerCase()
          .includes(value);
      const matchesCategory = selectedCategory === "All" || report.category === selectedCategory;
      return matchesQuery && matchesCategory && inBudget(report, budget);
    });

    return matches.sort((a, b) => {
      if (sort === "Lowest price") return a.price - b.price;
      if (sort === "Highest rating") return b.rating - a.rating;
      return b.match - a.match;
    });
  }, [budget, query, selectedCategory, sort]);

  const preview = filteredReports.find((report) => report.id === previewId) ?? filteredReports[0];

  const toggleShortlist = (id: number) => {
    setShortlist((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="min-h-screen pb-20">
      <section className="border-b border-[var(--line)] bg-white/62 py-16">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="eyebrow">Research marketplace</span>
              <h1 className="mt-4 text-6xl md:text-7xl">Buy signal, not shelfware.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8">
                Search vetted research by category, price, delivery, and fit. Preview
                outcomes before you shortlist or buy.
              </p>
            </div>
            <div className="surface grid min-w-[260px] grid-cols-2 gap-px overflow-hidden bg-[var(--line)]">
              <div className="bg-white p-5">
                <p className="mono text-xs font-semibold uppercase">Reports</p>
                <div className="display mt-2 text-4xl">{reports.length}</div>
              </div>
              <div className="bg-white p-5">
                <p className="mono text-xs font-semibold uppercase">Shortlist</p>
                <div className="display mt-2 text-4xl">{shortlist.length}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="surface p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_170px]">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search reports, analysts, tags..."
                className="input-base input-icon"
              />
            </label>
            <label className="relative block">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
              <select
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="select-base input-icon appearance-none"
              >
                {budgetOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
            </label>
            <label className="relative block">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="select-base appearance-none"
              >
                {["Best match", "Highest rating", "Lowest price"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
            </label>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setQuery("");
                setSelectedCategory("All");
                setBudget("Any budget");
                setSort("Best match");
              }}
            >
              Reset
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`tag ${selectedCategory === category ? "tag-teal" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {filteredReports.slice(0, visibleCount).map((report) => {
            const isShortlisted = shortlist.includes(report.id);
            return (
              <article
                key={report.id}
                className={`quiet-surface p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--teal)] ${
                  preview?.id === report.id ? "border-[var(--teal)] bg-white" : ""
                }`}
              >
                <div className="grid gap-5 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className={`tag ${tierClass[report.tier]}`}>{report.tier}</span>
                      <span className="tag">{report.category}</span>
                      <span className="tag">{report.delivery}</span>
                    </div>
                    <h2 className="font-sans text-2xl font-extrabold leading-tight">
                      {report.title}
                    </h2>
                    <p className="mt-3 max-w-3xl leading-7">{report.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {report.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-w-[190px] flex-col justify-between gap-5 border-t border-[var(--line)] pt-5 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <Star size={17} fill="var(--gold)" className="text-[var(--gold)]" />
                        <span className="font-extrabold">{report.rating}</span>
                        <span className="text-sm text-[var(--muted)]">({report.reviews})</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <CircleDollarSign size={18} className="text-[var(--teal)]" />
                        <span className="text-2xl font-black">${report.price}</span>
                      </div>
                      <p className="mt-2 text-sm">{report.match}% match</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="btn-secondary flex-1" onClick={() => setPreviewId(report.id)}>
                        Preview
                      </button>
                      <button
                        type="button"
                        className={`btn-secondary w-12 p-0 ${isShortlisted ? "bg-[var(--teal-soft)] text-[var(--teal-dark)]" : ""}`}
                        aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
                        onClick={() => toggleShortlist(report.id)}
                      >
                        {isShortlisted ? <Check size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredReports.length === 0 && (
            <div className="quiet-surface p-10 text-center">
              <h2 className="font-sans text-2xl font-extrabold">No reports match those filters.</h2>
              <p className="mt-3">Reset the filters or try a broader search term.</p>
            </div>
          )}

          {visibleCount < filteredReports.length && (
            <button
              type="button"
              className="btn-secondary justify-self-center px-8"
              onClick={() => setVisibleCount((count) => count + 3)}
            >
              Load more reports
            </button>
          )}
        </div>

        <aside className="surface h-fit p-6 lg:sticky lg:top-24">
          {preview ? (
            <>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow">Preview</span>
                  <h2 className="mt-3 font-sans text-2xl font-extrabold leading-tight">
                    {preview.title}
                  </h2>
                </div>
                <span className="display text-5xl text-[var(--teal)]">{preview.match}</span>
              </div>
              <p className="leading-7">{preview.description}</p>
              <div className="my-6 h-px bg-[var(--line)]" />
              <h3 className="font-sans text-sm font-black uppercase">Expected outcomes</h3>
              <div className="mt-4 grid gap-3">
                {preview.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-3 text-sm font-bold">
                    <Check size={17} className="text-[var(--teal)]" />
                    {outcome}
                  </div>
                ))}
              </div>
              <div className="my-6 h-px bg-[var(--line)]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Analyst</p>
                  <p className="font-extrabold text-[var(--ink)]">{preview.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Price</p>
                  <p className="font-extrabold text-[var(--ink)]">${preview.price}</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary mt-6 w-full"
                onClick={() => toggleShortlist(preview.id)}
              >
                {shortlist.includes(preview.id) ? "Shortlisted" : "Add to shortlist"}
                <ArrowRight size={18} />
              </button>
            </>
          ) : (
            <p>Select a report to preview outcomes.</p>
          )}
        </aside>
      </section>
    </div>
  );
}
