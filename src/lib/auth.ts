import { supabase } from './supabase'

export async function checkAdminStatus() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return false
    }

    const { data: isAdmin } = await supabase
      .rpc('is_admin', { user_id: session.user.id })

    return isAdmin
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}