import { supabase } from '../../../utils/supabaseClient';
import { sendOtpEmail } from './Emailing/email';

export async function loginAndSendOtp(accessID, password) {
  // Find user by email or username
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .or(`email.eq.${accessID},username.eq.${accessID}`)
    .maybeSingle();
    
    console.log(userError);
  if (userError || !userData) throw new Error("Invalid credentials.");


  // Authenticate with Supabase Auth using email
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password
  });

  console.log(authError);
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