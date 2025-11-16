/**
 * Hook for managing exchange rates in components
 */

import { useState, useEffect, useCallback } from 'react'
import { getExchangeRate, clearExchangeRateCache, type ExchangeRateData } from '@/lib/exchange-rate'

export function useExchangeRate() {
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRateData>({
    rate: 18.5,
    lastUpdated: new Date(),
    source: 'default',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRate = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getExchangeRate()
      setExchangeRateData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exchange rate')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshRate = useCallback(async () => {
    clearExchangeRateCache()
    await fetchRate()
  }, [fetchRate])

  useEffect(() => {
    fetchRate()
  }, [fetchRate])

  return {
    exchangeRate: exchangeRateData.rate,
    exchangeRateData,
    isLoading,
    error,
    refreshRate,
  }
}
