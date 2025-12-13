import { createClient } from '@/lib/supabase/server'
import type { SignalCategory, UserSignalWithDetails, ProfileWithSignals } from '@/types/signals'

// Fetch all signal categories
export async function getSignalCategories(): Promise<SignalCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('signal_categories')
    .select('*')
    .order('display_order')

  if (error) throw error
  return data || []
}

// Fetch all signals with their categories
export async function getSignalsWithCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('signals')
    .select(`
      *,
      category:signal_categories(*)
    `)
    .order('display_order')

  if (error) throw error
  return data || []
}

// Fetch signals grouped by category
export async function getSignalsByCategory() {
  const signals = await getSignalsWithCategories()

  const grouped = signals.reduce((acc, signal) => {
    // @ts-ignore - Supabase type inference issue
    const categoryId = signal.category_id
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    // @ts-ignore - Supabase type inference issue
    acc[categoryId].push(signal)
    return acc
  }, {} as Record<string, any[]>)

  return grouped
}

// Fetch user's current signals
export async function getUserSignals(userId: string): Promise<UserSignalWithDetails[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_signals')
    .select(`
      *,
      signal:signals(
        *,
        category:signal_categories(*)
      )
    `)
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

// Fetch user profile with signals
export async function getProfileWithSignals(userId: string): Promise<ProfileWithSignals | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      signals:user_signals(
        *,
        signal:signals(
          *,
          category:signal_categories(*)
        )
      )
    `)
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Add a signal to user's profile
export async function addUserSignal(userId: string, signalId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_signals')
    // @ts-ignore - Supabase type inference issue
    .insert({
      user_id: userId,
      signal_id: signalId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Remove a signal from user's profile
export async function removeUserSignal(userId: string, signalId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('user_signals')
    .delete()
    .eq('user_id', userId)
    .eq('signal_id', signalId)

  if (error) throw error
}

// Search profiles by signals
export async function searchProfilesBySignals(signalIds: string[]) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      signals:user_signals(
        *,
        signal:signals(
          *,
          category:signal_categories(*)
        )
      )
    `)
    .in('signals.signal_id', signalIds)

  if (error) throw error
  return data || []
}
