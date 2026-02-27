/**
 * API client for backend_Education integration.
 * Base URL from NEXT_PUBLIC_API_URL
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export interface RequestConfig extends Omit<RequestInit, "body"> {
  skipAuth?: boolean;
  institutionId?: string;
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getInstitutionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("institutionId");
}

export async function apiFetch<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const { skipAuth = false, institutionId: configInstId, body, headers = {}, ...rest } = config;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
    const instId = configInstId ?? getInstitutionId();
    if (instId) reqHeaders["x-institution-id"] = instId;
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const init: RequestInit = { ...rest, headers: reqHeaders };

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      delete reqHeaders["Content-Type"];
      init.body = body;
    } else {
      init.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    let errMsg = res.statusText;
    try {
      const data = await res.json() as { message?: string | string[] };
      errMsg = Array.isArray(data.message) ? data.message.join(", ") : (data.message ?? errMsg);
    } catch {
      // ignore
    }
    throw new ApiError(errMsg, res.status);
  }

  const ct = res.headers.get("content-type");
  if (ct?.includes("application/json")) return res.json() as Promise<T>;
  return res.text() as unknown as Promise<T>;
}
