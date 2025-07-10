import { supabase } from '../../../utils/supabaseClient';
import { sendOtpEmail } from './Emailing/email';

/**
 * Login and send OTP.
 * Accepts accessID as email, username, or account number.
 */
export async function loginAndSendOtp(accessID, password) {
  // Try to find user by email, username, or account number
  let userData = null;
  let userError = null;

  // 1. Try email or username
  let res = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .or(`email.eq.${accessID},username.eq.${accessID}`)
    .maybeSingle();

  userData = res.data;
  userError = res.error;

  // 2. If not found, try by account number
  if ((!userData || userError) && accessID) {
    // Find account by account_number
    const { data: account, error: accError } = await supabase
      .from("accounts")
      .select("user_id")
      .eq("account_number", accessID)
      .maybeSingle();

    if (account && account.user_id) {
      // Get user profile by user_id
      const { data: profile, error: profError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("id", account.user_id)
        .maybeSingle();
      userData = profile;
      userError = profError;
    }
  }

  if (userError || !userData) throw new Error("Invalid credentials.");

  // Authenticate with Supabase Auth using email
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password
  });

  if (authError || !authData?.user) throw new Error("Invalid credentials.");

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Store OTP in login_otps table
  await supabase.from("login_otps").insert({
    user_id: userData.id,
    otp,
    expires_at: expiresAt,
    used: false,
    temp_password: password // Store password temporarily for OTP verification
  });

  // Send OTP email
  await sendOtpEmail({
    to: userData.email,
    name: userData.full_name,
    otp
  });

  // Show OTP input in your view
  return true;
}