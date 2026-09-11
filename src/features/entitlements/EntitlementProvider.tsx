/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getNativeEntitlementStatus,
  hasNativeBridge,
  purchaseNativeFullVersion,
  restoreNativeFullVersion,
  type NativeEntitlementStatus,
} from '../../native/bridge'
import { useLanguage } from '../../i18n'

const WEB_STATUS: NativeEntitlementStatus = {
  unlocked: true,
  productAvailable: false,
  price: 'CHF 1.00',
}

interface EntitlementContextValue {
  native: boolean
  status: NativeEntitlementStatus
  loading: boolean
  message: string
  purchase: () => Promise<void>
  restore: () => Promise<void>
}

const EntitlementContext = createContext<EntitlementContextValue>({
  native: false,
  status: WEB_STATUS,
  loading: false,
  message: '',
  purchase: async () => undefined,
  restore: async () => undefined,
})

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const native = typeof window !== 'undefined' && hasNativeBridge()
  const [status, setStatus] = useState<NativeEntitlementStatus>(
    native ? { unlocked: false, productAvailable: false, price: 'CHF 1.00' } : WEB_STATUS,
  )
  const [loading, setLoading] = useState(native)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!native) return
    let active = true
    getNativeEntitlementStatus()
      .then((next) => {
        if (active) setStatus(next)
      })
      .catch(() => {
        if (active) setMessage(t('storeUnavailable'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [native, t])

  const purchase = useCallback(async () => {
    setLoading(true)
    setMessage('')
    try {
      const next = await purchaseNativeFullVersion()
      setStatus(next)
      setMessage(next.unlocked ? t('purchaseSuccess') : '')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Der Kauf wurde nicht abgeschlossen.')
    } finally {
      setLoading(false)
    }
  }, [t])

  const restore = useCallback(async () => {
    setLoading(true)
    setMessage('')
    try {
      const next = await restoreNativeFullVersion()
      setStatus(next)
      setMessage(next.unlocked ? t('restoreSuccess') : t('restoreEmpty'))
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Wiederherstellen hat noch nicht geklappt.',
      )
    } finally {
      setLoading(false)
    }
  }, [t])

  const value = useMemo(
    () => ({ native, status, loading, message, purchase, restore }),
    [loading, message, native, purchase, restore, status],
  )
  return <EntitlementContext.Provider value={value}>{children}</EntitlementContext.Provider>
}

export function useEntitlement() {
  return useContext(EntitlementContext)
}
