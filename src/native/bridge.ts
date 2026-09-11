export type NativeRequestType =
  | 'parent-authorization'
  | 'entitlement-status'
  | 'purchase-full-version'
  | 'restore-full-version'
  | 'haptic'

interface NativeRequest {
  id: string
  type: NativeRequestType
  payload?: Record<string, unknown>
}

interface NativeResponse {
  id: string
  ok: boolean
  value?: unknown
  error?: string
}

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        crazyLab?: { postMessage: (request: NativeRequest) => void }
      }
    }
    crazyLabNativeResponse?: (response: NativeResponse) => void
  }
}

const pending = new Map<
  string,
  { resolve: (value: unknown) => void; reject: (reason: Error) => void; timeout: number }
>()

function installResponseHandler() {
  window.crazyLabNativeResponse = (response) => {
    const request = pending.get(response.id)
    if (!request) return
    window.clearTimeout(request.timeout)
    pending.delete(response.id)
    if (response.ok) request.resolve(response.value)
    else request.reject(new Error(response.error || 'Native Anfrage fehlgeschlagen.'))
  }
}

export function hasNativeBridge(): boolean {
  return Boolean(window.webkit?.messageHandlers?.crazyLab)
}

export function sendNativeRequest<T>(
  type: NativeRequestType,
  payload?: Record<string, unknown>,
): Promise<T> {
  const handler = window.webkit?.messageHandlers?.crazyLab
  if (!handler) return Promise.reject(new Error('Native Bridge ist nicht verfügbar.'))
  installResponseHandler()
  const id = `native-${Date.now()}-${Math.random().toString(36).slice(2)}`
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      pending.delete(id)
      reject(new Error('Native Anfrage hat zu lange gedauert.'))
    }, 30_000)
    pending.set(id, {
      resolve: (value) => resolve(value as T),
      reject,
      timeout,
    })
    handler.postMessage({ id, type, payload })
  })
}

export async function requestNativeParentAuthorization(reason: string): Promise<boolean> {
  return sendNativeRequest<boolean>('parent-authorization', { reason })
}

export async function triggerNativeHaptic(kind: 'selection' | 'success' | 'warning') {
  if (!hasNativeBridge()) return
  await sendNativeRequest<boolean>('haptic', { kind }).catch(() => false)
}
