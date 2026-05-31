import type { ApiResponse } from "../types/Api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  sessionToken?: string;
  body?: unknown;
}

export default class ApiClient {
  private static get baseUrl() { return import.meta.env.VITE_API_URL as string; }
  private static get apiKey() { return import.meta.env.VITE_API_KEY as string; }

  static async request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      Authorization: ApiClient.apiKey,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (options.sessionToken) {
      headers["x-session-token"] = options.sessionToken;
    }

    const response = await fetch(`${ApiClient.baseUrl}${path}`, {
      method,
      headers,
      body: isFormData
        ? (options.body as FormData)
        : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
    });

    const data: ApiResponse<T> = await response.json().catch(() => {
      throw new Error(`Error ${response.status}`);
    });

    if (!response.ok || data.code !== 200) {
      throw new Error(data.error || `Error ${data.code}`);
    }

    return data.data;
  }

  static get<T>(path: string, sessionToken?: string) {
    return ApiClient.request<T>("GET", path, { sessionToken });
  }

  static post<T>(path: string, body: unknown, sessionToken?: string) {
    return ApiClient.request<T>("POST", path, { body, sessionToken });
  }

  static patch<T>(path: string, body: unknown, sessionToken?: string) {
    return ApiClient.request<T>("PATCH", path, { body, sessionToken });
  }

  static delete<T>(path: string, body?: unknown, sessionToken?: string) {
    return ApiClient.request<T>("DELETE", path, { body, sessionToken });
  }
}
