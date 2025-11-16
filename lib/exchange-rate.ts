/**
 * Exchange Rate Service
 * Fetches and caches USD to ZAR exchange rates
 */

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD'
const CACHE_KEY = 'exchangeRate'
const CACHE_TIMESTAMP_KEY = 'exchangeRateTimestamp'
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour in milliseconds
const DEFAULT_RATE = 18.5 // Fallback rate

export interface ExchangeRateData {
  rate: number
  lastUpdated: Date
  source: 'api' | 'cache' | 'default'
}

/**
 * Fetches the current USD to ZAR exchange rate
 * Uses cached value if available and not expired
 */
export async function getExchangeRate(): Promise<ExchangeRateData> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      rate: DEFAULT_RATE,
      lastUpdated: new Date(),
      source: 'default',
    }
  }

  // Try to get cached rate
  const cachedRate = getCachedRate()
  if (cachedRate) {
    return cachedRate
  }

  // Fetch fresh rate from API
  try {
    const response = await fetch(EXCHANGE_RATE_API)
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate')
    }

    const data = await response.json()
    const rate = data.rates?.ZAR

    if (!rate || typeof rate !== 'number') {
      throw new Error('Invalid exchange rate data')
    }

    // Cache the rate
    cacheRate(rate)

    return {
      rate,
      lastUpdated: new Date(),
      source: 'api',
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error)

    // Return default rate as fallback
    return {
      rate: DEFAULT_RATE,
      lastUpdated: new Date(),
      source: 'default',
    }
  }
}

/**
 * Gets cached exchange rate if available and not expired
 */
function getCachedRate(): ExchangeRateData | null {
  try {
    const cachedRate = localStorage.getItem(CACHE_KEY)
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)

    if (!cachedRate || !cachedTimestamp) {
      return null
    }

    const timestamp = parseInt(cachedTimestamp, 10)
    const now = Date.now()

    // Check if cache is still valid
    if (now - timestamp > CACHE_DURATION) {
      // Cache expired, clear it
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TIMESTAMP_KEY)
      return null
    }

    const rate = parseFloat(cachedRate)
    if (isNaN(rate)) {
      return null
    }

    return {
      rate,
      lastUpdated: new Date(timestamp),
      source: 'cache',
    }
  } catch (error) {
    console.error('Error reading cached exchange rate:', error)
    return null
  }
}

/**
 * Caches the exchange rate in localStorage
 */
function cacheRate(rate: number): void {
  try {
    localStorage.setItem(CACHE_KEY, rate.toString())
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Error caching exchange rate:', error)
  }
}

/**
 * Clears the cached exchange rate
 */
export function clearExchangeRateCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_TIMESTAMP_KEY)
  } catch (error) {
    console.error('Error clearing exchange rate cache:', error)
  }
}

/**
 * Formats the exchange rate update time
 */
export function formatUpdateTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  return date.toLocaleDateString()
}
