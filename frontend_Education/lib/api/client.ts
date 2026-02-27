/**
 * Base API client for backend communication.
 * Handles auth headers, institution context, and error parsing.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export interface RequestConfig extends Omit<RequestInit, "body"> {
  skipAuth?: boolean;
  institutionId?: string;
  body?: unknown;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body?: ApiErrorResponse
  ) {
    super(message);
    this.name = "ApiClientError";
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
  const {
    skipAuth = false,
    institutionId: configInstitutionId,
    body,
    headers: configHeaders = {},
    ...rest
  } = config;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(configHeaders as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const instId = configInstitutionId ?? getInstitutionId();
    if (instId) {
      headers["x-institution-id"] = instId;
    }
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const init: RequestInit = {
    ...rest,
    headers,
  };

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    init.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    delete (init.headers as Record<string, string>)["Content-Type"];
    init.body = body;
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    let errorBody: ApiErrorResponse | null = null;
    try {
      const text = await res.text();
      if (text) {
        errorBody = JSON.parse(text) as ApiErrorResponse;
      }
    } catch {
      // Ignore parse errors
    }

    const message =
      (Array.isArray(errorBody?.message)
        ? errorBody?.message?.join(", ")
        : errorBody?.message) ||
      res.statusText ||
      `Request failed: ${res.status}`;

    throw new ApiClientError(message, res.status, errorBody ?? undefined);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as Promise<T>;
}
