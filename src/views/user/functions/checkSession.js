import { supabase } from '../../../utils/supabaseClient';

/**
 * Checks if a user is logged in and fetches their profile and account data.
 * Returns null if not logged in, or an object with user, profile, and account.
 */
export async function checkSession() {
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) return null;

  const userId = session.user.id;

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) return null;

  // Fetch account info
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  // You can add more queries here for notifications, transfers, etc.

  return {
    user: session.user,
    profile,
    account: account || null,
    
  };
}