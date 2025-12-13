import type { Database } from './database'

export type SignalCategory = Database['public']['Tables']['signal_categories']['Row']
export type Signal = Database['public']['Tables']['signals']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserSignal = Database['public']['Tables']['user_signals']['Row']

export interface SignalWithCategory extends Signal {
  category: SignalCategory
}

export interface UserSignalWithDetails extends UserSignal {
  signal: SignalWithCategory
}

export interface ProfileWithSignals extends Profile {
  signals: UserSignalWithDetails[]
}

// Constraint constants from design doc
export const CONSTRAINTS = {
  MAX_TOTAL_SIGNALS: 5,
  CATEGORY_LIMITS: {
    availability: 2,
    learning: 99, // effectively unlimited
    contribution: 99,
    perspective: 3,
  },
} as const

export type CategoryId = keyof typeof CONSTRAINTS.CATEGORY_LIMITS

// Helper to check if adding a signal would violate constraints
export function canAddSignal(
  currentSignals: UserSignalWithDetails[],
  newSignal: Signal
): { allowed: boolean; reason?: string } {
  // Check total signals limit
  if (currentSignals.length >= CONSTRAINTS.MAX_TOTAL_SIGNALS) {
    return {
      allowed: false,
      reason: `Maximum ${CONSTRAINTS.MAX_TOTAL_SIGNALS} signals allowed`,
    }
  }

  // Check category limit
  const categoryId = newSignal.category_id as CategoryId
  const categoryLimit = CONSTRAINTS.CATEGORY_LIMITS[categoryId]
  const categoryCount = currentSignals.filter(
    (s) => s.signal.category_id === categoryId
  ).length

  if (categoryCount >= categoryLimit) {
    return {
      allowed: false,
      reason: `Maximum ${categoryLimit} signals allowed in this category`,
    }
  }

  return { allowed: true }
}

// Helper to check if a signal is expired
export function isSignalExpired(userSignal: UserSignal): boolean {
  if (!userSignal.expires_at) return false
  return new Date(userSignal.expires_at) < new Date()
}

// Helper to get days until expiration
export function getDaysUntilExpiration(userSignal: UserSignal): number | null {
  if (!userSignal.expires_at) return null
  const now = new Date()
  const expiresAt = new Date(userSignal.expires_at)
  const diffMs = expiresAt.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}
