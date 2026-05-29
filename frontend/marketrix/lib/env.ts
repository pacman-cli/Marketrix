const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const env = {
  apiUrl,
};

export function getApiUrl() {
  if (!env.apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return env.apiUrl.replace(/\/+$/, "");
}
