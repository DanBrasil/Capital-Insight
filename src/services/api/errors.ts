import type { AxiosError } from 'axios'

// ─── AppError — the single error shape used across the whole frontend ─────────

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN'

export interface AppError {
  /** Human-readable message safe to display in the UI */
  message: string
  /** HTTP status code (0 for network errors) */
  status: number
  /** Machine-readable code for conditional error handling */
  code: ApiErrorCode
  /** Present when the backend returns field-level validation errors */
  field?: string
}

// ─── Backend error DTO (what the API typically returns in error responses) ────

interface ApiErrorResponse {
  message?: string
  error?: string
  field?: string
  code?: string
}

// ─── Status → code mapping ────────────────────────────────────────────────────

function statusToCode(status: number): ApiErrorCode {
  if (status === 401) return 'UNAUTHORIZED'
  if (status === 403) return 'FORBIDDEN'
  if (status === 404) return 'NOT_FOUND'
  if (status === 409) return 'CONFLICT'
  if (status === 422 || status === 400) return 'VALIDATION_ERROR'
  return 'UNKNOWN'
}

// ─── Fallback messages ────────────────────────────────────────────────────────

const FALLBACK_MESSAGES: Record<ApiErrorCode, string> = {
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para realizar esta ação.',
  NOT_FOUND: 'O recurso solicitado não foi encontrado.',
  VALIDATION_ERROR: 'Verifique os dados informados e tente novamente.',
  CONFLICT: 'Este registro já existe.',
  NETWORK_ERROR: 'Sem conexão com o servidor. Verifique sua internet.',
  TIMEOUT: 'A requisição demorou muito. Tente novamente.',
  UNKNOWN: 'Ocorreu um erro inesperado. Tente novamente.',
}

// ─── Parser — called once in the Axios response interceptor ──────────────────

/**
 * Converts any thrown error (AxiosError, network error, timeout, unknown)
 * into a predictable AppError.
 *
 * Call this ONCE in the Axios interceptor so every hook receives a clean shape.
 * Components only need to read `error.message` — no `error.response?.data?.message` chains.
 */
export function parseApiError(error: unknown): AppError {
  const axiosError = error as AxiosError<ApiErrorResponse>

  // Network error — request never reached the server
  if (axiosError.code === 'ERR_NETWORK') {
    return { message: FALLBACK_MESSAGES.NETWORK_ERROR, status: 0, code: 'NETWORK_ERROR' }
  }

  // Timeout
  if (axiosError.code === 'ECONNABORTED') {
    return { message: FALLBACK_MESSAGES.TIMEOUT, status: 0, code: 'TIMEOUT' }
  }

  if (axiosError.response) {
    const { status, data } = axiosError.response
    const code = statusToCode(status)
    const backendMessage = data?.message ?? data?.error
    return {
      message: backendMessage ?? FALLBACK_MESSAGES[code],
      status,
      code,
      field: data?.field,
    }
  }

  return { message: FALLBACK_MESSAGES.UNKNOWN, status: 0, code: 'UNKNOWN' }
}
