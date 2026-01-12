// src/api/request.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>
  data?: any
}

export interface ApiError extends Error {
  status?: number
  code?: string
}

/** query 参数序列化 */
function serializeParams(params?: Record<string, any>) {
  if (!params) return ""

  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return
    query.append(key, String(value))
  })

  const qs = query.toString()
  return qs ? `?${qs}` : ""
}

export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, data, headers, ...rest } = options

  const fullUrl = `${BASE_URL}${url}${serializeParams(params)}`

  const res = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...rest,
  })

  if (!res.ok) {
    const error: ApiError = new Error(res.statusText)
    error.status = res.status
    throw error
  }

  return res.json()
}
