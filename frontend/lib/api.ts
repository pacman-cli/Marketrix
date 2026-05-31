import { getApiUrl } from "./env";

// --- Types ---

export type BriefSubmitPayload = {
  name: string;
  industry: string;
  stage: string;
  geography?: string;
  budget?: string;
  goals: string[];
  problems?: string[];
  competitors?: string[];
};

export type BriefResponse = {
  id: string;
  name: string;
  industry: string;
  stage: string;
  geography?: string;
  budget?: string;
  goals: string[];
  problems?: string[];
  competitors?: string[];
  status: string;
  createdAt: string;
};

export type ReportResponse = {
  id: string;
  analystId: string;
  title: string;
  description: string;
  price: number;
  tier: string;
  category: string;
  tags: string[];
  previewText: string;
  purchaseCount: number;
  status: string;
  createdAt: string;
};

export type RecommendationResponse = {
  id: string;
  type: string;
  targetId: string | null;
  score: number;
  explanation: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    bio?: string;
    expertiseTags?: string[];
    avatarUrl?: string;
  };
};

// --- Token management ---

const TOKEN_KEY = "marketrix_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// --- Core request function ---

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `Request failed: ${response.status}` }));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// --- Auth ---

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string, fullName: string, role: string) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, fullName, role }),
  });
}

// --- Briefs ---

export function submitStartupBrief(payload: BriefSubmitPayload) {
  return apiRequest<BriefResponse>("/api/startups/brief", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyBriefs() {
  return apiRequest<BriefResponse[]>("/api/startups/my-briefs");
}

// --- Reports ---

export function getReports(page = 0, size = 20) {
  return apiRequest<{ content: ReportResponse[]; totalElements: number; totalPages: number }>(
    `/api/reports?page=${page}&size=${size}`
  );
}

// --- Recommendations ---

export function getRecommendations(requirementId: string) {
  return apiRequest<RecommendationResponse[]>(`/api/recommendations/${requirementId}`);
}

// --- Marketplace (Gigs) ---

export type GigResponse = {
  id: string;
  founderId: string;
  title: string;
  description: string;
  budget: number;
  requirements: string[];
  status: string;
  createdAt: string;
};

export function getGigs(page = 0, size = 20) {
  return apiRequest<{ content: GigResponse[]; totalElements: number; totalPages: number }>(
    `/api/marketplace/gigs?page=${page}&size=${size}`
  );
}

export function createGig(title: string, description: string, budget: number, requirements: string[]) {
  return apiRequest<GigResponse>("/api/marketplace/gigs", {
    method: "POST",
    body: JSON.stringify({ title, description, budget: budget.toString(), requirements }),
  });
}

export function applyToGig(gigId: string, coverLetter: string, proposedPrice: number) {
  return apiRequest<unknown>(`/api/marketplace/gigs/${gigId}/apply`, {
    method: "POST",
    body: JSON.stringify({ coverLetter, proposedPrice: proposedPrice.toString() }),
  });
}
