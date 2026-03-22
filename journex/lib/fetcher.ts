import { isApiError } from '@/types/api'
import type { ApiResponse } from '@/types/api'

export class ApiRequestError extends Error {
  public readonly code: string | undefined

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'ApiRequestError'
    this.code = code
  }
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const json = (await response.json()) as ApiResponse<T>

  if (isApiError(json)) {
    throw new ApiRequestError(json.error, json.code)
  }

  return json.data
}

export const api = {
  get: <T>(url: string): Promise<T> => apiFetch<T>(url),

  post: <TBody, TResponse>(url: string, body: TBody): Promise<TResponse> =>
    apiFetch<TResponse>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: <TBody, TResponse>(url: string, body: TBody): Promise<TResponse> =>
    apiFetch<TResponse>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <TResponse>(url: string): Promise<TResponse> =>
    apiFetch<TResponse>(url, { method: 'DELETE' }),
}
