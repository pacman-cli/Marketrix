"use client";

import { ArrowRight, BarChart3, FileText, MessageSquare, Star } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            Welcome back, <span className="gradient-text">Sarah</span>
          </h1>
          <p className="text-lg text-slate-300">
            Here's your market research dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Active Briefs", value: "3", icon: FileText },
            { label: "Research Saved", value: "12", icon: Star },
            { label: "Messages", value: "8", icon: MessageSquare },
            { label: "Total Spent", value: "$2,450", icon: BarChart3 },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-minimal">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-display font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-violet-600/20 flex items-center justify-center">
                    <Icon className="text-violet-400" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recent Briefs */}
            <div className="card-minimal mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">Active Briefs</h2>
                <Link href="/submit-brief" className="btn-primary text-sm">
                  New Brief
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((brief) => (
                  <div
                    key={brief}
                    className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          Market Analysis: AI EdTech
                        </h4>
                        <p className="text-sm text-slate-400">
                          Submitted 3 days ago · 4 recommendations
                        </p>
                      </div>
                      <span className="badge-success">Processing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="card-minimal">
              <h2 className="text-2xl font-display font-bold mb-6">
                Recommended Research
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "SaaS Market Trends 2026",
                    match: "98%",
                    price: "$299",
                  },
                  {
                    title: "AI Applications in EdTech",
                    match: "95%",
                    price: "$199",
                  },
                  {
                    title: "Growth Strategy Playbook",
                    match: "92%",
                    price: "$149",
                  },
                ].map((rec) => (
                  <div
                    key={rec.title}
                    className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-all flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">
                        {rec.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-700 rounded-full h-1 max-w-xs">
                          <div
                            className="bg-gradient-to-r from-violet-600 to-cyan-500 h-1 rounded-full"
                            style={{
                              width: rec.match,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-violet-400">
                          {rec.match} match
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-semibold text-white mb-2">{rec.price}</p>
                      <button className="btn-secondary text-sm py-1 px-3">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Analyst Recommendations */}
            <div className="card-minimal mb-8">
              <h3 className="text-xl font-display font-bold mb-4">
                Expert Analysts
              </h3>

              <div className="space-y-4">
                {[
                  { name: "Emma Sterling", expertise: "SaaS Growth" },
                  { name: "Dr. Chen", expertise: "Healthcare AI" },
                  { name: "Alex Rodriguez", expertise: "Web3 Strategy" },
                ].map((analyst) => (
                  <div
                    key={analyst.name}
                    className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div>
                      <p className="font-medium text-white text-sm">
                        {analyst.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {analyst.expertise}
                      </p>
                    </div>
                    <button className="btn-secondary text-xs py-1 px-2">
                      Hire
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="card-minimal bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border-violet-600/30">
              <h3 className="text-lg font-semibold text-white mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ Add specific markets for better matches</li>
                <li>✓ Use industry jargon in your brief</li>
                <li>✓ Reference competitors for context</li>
                <li>✓ Set realistic budgets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
