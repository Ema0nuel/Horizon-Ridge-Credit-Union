import { supabase } from '../../../utils/supabaseClient';
import { sendOtpEmail } from './Emailing/email';

/**
 * Find user profile by accessID (email, username, or account number).
 * Returns profile or null.
 */
export async function findUserByAccessID(accessID) {
  if (!accessID) return null;

  // 1. Try email
  let { data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("email", accessID)
    .maybeSingle();

  if (data) return data;

  // 2. Try username
  ({ data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("username", accessID)
    .maybeSingle());

  if (data) return data;

  // 3. Try account number
  const { data: account } = await supabase
    .from("accounts")
    .select("user_id")
    .eq("account_number", accessID)
    .maybeSingle();

  if (account?.user_id) {
    ({ data } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", account.user_id)
      .maybeSingle());
  }

  return data || null;
}

/**
 * Login with password, then send OTP.
 * Accepts accessID as email, username, or account number.
 */
export async function loginAndSendOtp(accessID, password) {
  if (!accessID || !password) {
    throw new Error("Access ID and password are required.");
  }

  const userData = await findUserByAccessID(accessID);
  if (!userData) throw new Error("No account found with that Access ID.");
  if (!userData.email) throw new Error("Account has no email on file.");

  // Authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password
  });

  if (authError) {
    // Distinguish between wrong password and other auth errors
    if (authError.message?.toLowerCase().includes("invalid login credentials")) {
      throw new Error("Incorrect password. Please try again.");
    }
    throw new Error(authError.message || "Authentication failed.");
  }

  if (!authData?.user) throw new Error("Authentication failed. Please try again.");

  // Generate and store OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabase.from("login_otps").insert({
    user_id: userData.id,
    otp,
    expires_at: expiresAt,
    used: false,
    temp_password: password
  });

  // Send OTP email
  await sendOtpEmail({
    to: userData.email,
    name: userData.full_name,
    otp
  });

  return true;
}

/**
 * Resend OTP without re-authenticating password.
 * Only looks up user and generates a new OTP.
 */
export async function resendOtp(accessID) {
  if (!accessID) throw new Error("Access ID is required.");

  const userData = await findUserByAccessID(accessID);
  if (!userData) throw new Error("No account found with that Access ID.");
  if (!userData.email) throw new Error("Account has no email on file.");

  // Check there's an existing unexpired OTP to reuse its temp_password
  const { data: existingOtp } = await supabase
    .from("login_otps")
    .select("temp_password")
    .eq("user_id", userData.id)
    .eq("used", false)
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const tempPassword = existingOtp?.temp_password || null;

  // Generate and store new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabase.from("login_otps").insert({
    user_id: userData.id,
    otp,
    expires_at: expiresAt,
    used: false,
    temp_password: tempPassword
  });

  // Send OTP email
  await sendOtpEmail({
    to: userData.email,
    name: userData.full_name,
    otp
  });

  return true;
}