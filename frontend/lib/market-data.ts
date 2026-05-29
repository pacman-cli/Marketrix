export type ResearchReport = {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  tier: "Flagship" | "Standard" | "Starter";
  delivery: string;
  match: number;
  description: string;
  tags: string[];
  outcomes: string[];
};

export type Analyst = {
  name: string;
  specialty: string;
  responseTime: string;
  rating: number;
};

export type Brief = {
  id: string;
  name: string;
  industry: string;
  stage: string;
  budget?: string;
  status: string;
  createdAt: string;
  goals: string[];
};

export const categories = ["All", "SaaS", "Healthcare", "FinTech", "Consumer", "EdTech", "AI"];

export const reports: ResearchReport[] = [
  {
    id: 1,
    title: "B2B SaaS Expansion Signals 2026",
    author: "Emma Sterling",
    category: "SaaS",
    price: 299,
    rating: 4.9,
    reviews: 127,
    tier: "Flagship",
    delivery: "34 pages",
    match: 98,
    description:
      "A field-tested readout on pricing pressure, buyer committees, usage-based expansion, and category entry points.",
    tags: ["Pricing", "GTM", "Enterprise"],
    outcomes: ["Segment attractiveness", "Pricing benchmarks", "Pipeline risks"],
  },
  {
    id: 2,
    title: "AI Workflow Adoption in Healthcare",
    author: "Dr. Michael Chen",
    category: "Healthcare",
    price: 219,
    rating: 4.8,
    reviews: 89,
    tier: "Standard",
    delivery: "26 pages",
    match: 94,
    description:
      "A practical map of where clinical and operations teams are actually buying AI tooling in 2026.",
    tags: ["AI", "Healthcare", "Regulation"],
    outcomes: ["Buyer map", "Regulatory watchouts", "Adoption barriers"],
  },
  {
    id: 3,
    title: "FinTech Trust and Conversion Benchmarks",
    author: "Priya Nair",
    category: "FinTech",
    price: 249,
    rating: 4.9,
    reviews: 104,
    tier: "Flagship",
    delivery: "31 pages",
    match: 91,
    description:
      "Behavioral benchmarks for onboarding, compliance messaging, and conversion in high-trust financial products.",
    tags: ["Trust", "Conversion", "Compliance"],
    outcomes: ["Funnel benchmarks", "Messaging tests", "Trust drivers"],
  },
  {
    id: 4,
    title: "Consumer Subscription Churn Playbook",
    author: "Lena Brooks",
    category: "Consumer",
    price: 149,
    rating: 4.7,
    reviews: 64,
    tier: "Starter",
    delivery: "18 pages",
    match: 88,
    description:
      "A concise playbook for diagnosing retention leaks, cancellation moments, and win-back opportunities.",
    tags: ["Retention", "Consumer", "Subscriptions"],
    outcomes: ["Churn taxonomy", "Win-back triggers", "Experiment plan"],
  },
  {
    id: 5,
    title: "EdTech Procurement and District Buying",
    author: "Noah Kim",
    category: "EdTech",
    price: 189,
    rating: 4.6,
    reviews: 52,
    tier: "Standard",
    delivery: "23 pages",
    match: 86,
    description:
      "A buyer journey map for district pilots, budget calendars, stakeholder objections, and renewal signals.",
    tags: ["Procurement", "Education", "B2B"],
    outcomes: ["Budget calendar", "Pilot criteria", "Renewal signals"],
  },
  {
    id: 6,
    title: "AI Agent Category Entry Map",
    author: "Mara Voss",
    category: "AI",
    price: 329,
    rating: 5,
    reviews: 76,
    tier: "Flagship",
    delivery: "39 pages",
    match: 97,
    description:
      "A strategy map for agent startups choosing wedge markets, workflow depth, and defensible data loops.",
    tags: ["Agents", "Strategy", "Moats"],
    outcomes: ["Wedge scoring", "Workflow depth", "Defensibility map"],
  },
];

export const analysts: Analyst[] = [
  {
    name: "Emma Sterling",
    specialty: "B2B SaaS pricing",
    responseTime: "2h",
    rating: 4.9,
  },
  {
    name: "Priya Nair",
    specialty: "FinTech conversion",
    responseTime: "4h",
    rating: 4.9,
  },
  {
    name: "Mara Voss",
    specialty: "AI category strategy",
    responseTime: "1h",
    rating: 5,
  },
];

export const demoBriefs: Brief[] = [
  {
    id: "MX-1042",
    name: "Northstar AI",
    industry: "AI",
    stage: "Seed",
    budget: "$1,000 - $5,000",
    status: "Matching",
    createdAt: "Today",
    goals: ["Find wedge market", "Benchmark buyer urgency"],
  },
  {
    id: "MX-1038",
    name: "AtlasCare",
    industry: "Healthcare",
    stage: "Series A",
    budget: "$5,000+",
    status: "Ready",
    createdAt: "2 days ago",
    goals: ["Map AI operations buyers", "Validate budget owner"],
  },
];

export const budgetOptions = ["Any budget", "Under $200", "$200 - $300", "$300+"];
