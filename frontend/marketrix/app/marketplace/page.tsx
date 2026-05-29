"use client";

import { Search, Filter, ChevronDown, Star, User, DollarSign } from "lucide-react";
import { useState } from "react";

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const reports = [
    {
      id: 1,
      title: "SaaS Market Trends 2026",
      author: "Emma Sterling",
      category: "SaaS",
      price: 299,
      rating: 4.9,
      reviews: 127,
      tier: "PREMIUM",
      description: "Comprehensive analysis of SaaS market dynamics, pricing strategies, and emerging opportunities.",
      tags: ["SaaS", "Trends", "Pricing"],
    },
    {
      id: 2,
      title: "AI Applications in Healthcare",
      author: "Dr. Michael Chen",
      category: "Healthcare",
      price: 199,
      rating: 4.8,
      reviews: 89,
      tier: "STANDARD",
      description: "Deep dive into AI adoption patterns, regulatory landscape, and investment opportunities.",
      tags: ["AI", "Healthcare", "Research"],
    },
    {
      id: 3,
      title: "Web3 User Acquisition Strategy",
      author: "Alex Rodriguez",
      category: "Web3",
      price: 149,
      rating: 4.7,
      reviews: 56,
      tier: "ACCESSIBLE",
      description: "Actionable playbook for acquiring users in the Web3 space during uncertain markets.",
      tags: ["Web3", "Growth", "Strategy"],
    },
    {
      id: 4,
      title: "EdTech Market Segmentation",
      author: "Lisa Wang",
      category: "EdTech",
      price: 249,
      rating: 4.9,
      reviews: 143,
      tier: "PREMIUM",
      description: "Detailed segmentation of EdTech market with buyer personas and expansion opportunities.",
      tags: ["EdTech", "Segmentation", "Analysis"],
    },
  ];

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      PREMIUM: "badge-primary",
      STANDARD: "badge-secondary",
      ACCESSIBLE: "badge-success",
    };
    return colors[tier] || "badge-primary";
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Market <span className="gradient-text">Research Marketplace</span>
          </h1>
          <p className="text-lg text-slate-300">
            Browse 2,400+ expert research reports from top analysts and researchers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search research reports..."
                className="input-base pl-12"
              />
            </div>

            {/* Filter Button */}
            <button className="btn-secondary flex items-center justify-center gap-2">
              <Filter size={20} />
              <span>Filters</span>
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {["All", "SaaS", "Healthcare", "Web3", "EdTech"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "badge-primary"
                    : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className="card-minimal group hover:border-violet-600/50"
              style={{
                animation: `float-in 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className={getTierColor(report.tier)}>
                  {report.tier}
                </span>
                <span className="badge-secondary text-xs">
                  {report.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:gradient-text transition-all">
                {report.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {report.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {report.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-slate-800/50 rounded text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
                    {report.author.split(" ")[0][0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{report.author}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{report.rating}</span>
                      <span>({report.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <DollarSign size={18} className="text-violet-400" />
                  <span className="text-lg font-semibold text-white">{report.price}</span>
                </div>
                <button className="btn-primary text-sm py-2 px-4">
                  View & Buy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <button className="btn-secondary text-lg px-8 py-4">
            Load More Reports
          </button>
        </div>
      </div>
    </div>
  );
}
