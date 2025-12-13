'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleSignal(userId: string, signalId: string, currentlySelected: boolean) {
  const supabase = await createClient()

  if (currentlySelected) {
    // Remove signal
    const { error } = await supabase
      .from('user_signals')
      .delete()
      .eq('user_id', userId)
      .eq('signal_id', signalId)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Add signal
    const { error } = await supabase
      .from('user_signals')
      .insert({
        user_id: userId,
        signal_id: signalId,
      })

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/profile')
  return { success: true }
}
