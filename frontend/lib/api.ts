import { getApiUrl } from "./env";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

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

export type BriefResponse = BriefSubmitPayload & {
  id: string;
  status: string;
  createdAt: string;
};

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  }).finally(() => clearTimeout(timeout));

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload?.data as T;
}

export function submitStartupBrief(payload: BriefSubmitPayload) {
  return apiRequest<BriefResponse>("/api/startups/brief", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
