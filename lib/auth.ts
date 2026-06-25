import { createClient } from "./supabaseClient";

export interface UserData {
  id: string;
  email: string;
  full_name: string;
}

/**
 * Find user profile by accessID (email, username, or account number).
 */
export async function findUserByAccessID(accessID: string): Promise<UserData | null> {
  const supabase = createClient();

  // Try email
  let { data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("email", accessID)
    .maybeSingle();

  if (data) return data;

  // Try username
  ({ data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("username", accessID)
    .maybeSingle());

  if (data) return data;

  // Try account number
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
 * Login with password, then store OTP in DB and send email.
 */
export async function loginAndSendOtp(accessID: string, password: string) {
  const supabase = createClient();

  if (!accessID || !password) {
    throw new Error("Access ID and password are required.");
  }

  const userData = await findUserByAccessID(accessID);
  if (!userData) throw new Error("No account found with that Access ID.");
  if (!userData.email) throw new Error("Account has no email on file.");

  // Authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password,
  });

  if (authError) {
    if (authError.message?.toLowerCase().includes("invalid login credentials")) {
      throw new Error("Incorrect password. Please try again.");
    }
    throw new Error(authError.message || "Authentication failed.");
  }

  if (!authData?.user) throw new Error("Authentication failed. Please try again.");

  // Generate and store OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const sessionToken = crypto.randomUUID();

  await supabase.from("login_otps").insert({
    user_id: userData.id,
    otp,
    expires_at: expiresAt,
    used: false,
    temp_password: sessionToken,
  });

  // Send OTP via the API route
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: userData.email,
      subject: "Your One-Time Password (OTP) for Login",
      html: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color: #1e3a8a;">Horizon Ridge Credit Union</h2>
          <p>Dear ${userData.full_name || "User"},</p>
          <p>Your One-Time Password (OTP) for login is:</p>
          <div style="font-size: 2rem; font-weight: bold; letter-spacing: 0.2em; color: #1e3a8a; margin: 16px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="margin: 24px 0;">
          <p style="font-size: 0.9em; color: #888;">Horizon Ridge Credit Union &copy; ${new Date().getFullYear()}</p>
        </div>
      `,
    }),
  });

  const result = await res.json();
  if (!result.success) {
    console.warn("OTP email send failed (non-blocking):", result.error);
  }

  return true;
}

/**
 * Verify OTP and mark as used.
 */
export async function verifyOtp(accessID: string, otp: string) {
  const supabase = createClient();

  const userData = await findUserByAccessID(accessID);
  if (!userData || !userData.id) {
    throw new Error("User not found. Please use a valid email address or account number.");
  }

  const { data: otpData, error: otpError } = await supabase
    .from("login_otps")
    .select("*")
    .eq("user_id", userData.id)
    .eq("otp", otp)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (otpError || !otpData) {
    throw new Error("Invalid or expired OTP.");
  }

  if (new Date(otpData.expires_at) < new Date()) {
    throw new Error("OTP has expired. Request a new one.");
  }

  const { error: updateError } = await supabase
    .from("login_otps")
    .update({ used: true, temp_password: null })
    .eq("id", otpData.id);

  if (updateError) {
    throw new Error("Could not verify OTP. Please try again.");
  }

  return true;
}

/**
 * Resend OTP without re-authenticating password.
 */
export async function resendOtp(accessID: string) {
  const supabase = createClient();

  if (!accessID) throw new Error("Access ID is required.");

  const userData = await findUserByAccessID(accessID);
  if (!userData) throw new Error("No account found with that Access ID.");
  if (!userData.email) throw new Error("Account has no email on file.");

  const { data: existingOtp } = await supabase
    .from("login_otps")
    .select("temp_password")
    .eq("user_id", userData.id)
    .eq("used", false)
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!existingOtp?.temp_password) {
    throw new Error("Session expired. Please log in again.");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabase.from("login_otps").insert({
    user_id: userData.id,
    otp,
    expires_at: expiresAt,
    used: false,
    temp_password: existingOtp.temp_password,
  });

  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: userData.email,
      subject: "Your One-Time Password (OTP) for Login",
      html: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color: #1e3a8a;">Horizon Ridge Credit Union</h2>
          <p>Dear ${userData.full_name || "User"},</p>
          <p>Your new OTP for login is:</p>
          <div style="font-size: 2rem; font-weight: bold; letter-spacing: 0.2em; color: #1e3a8a; margin: 16px 0;">${otp}</div>
          <p>This OTP is valid for 10 minutes.</p>
          <hr style="margin: 24px 0;">
          <p style="font-size: 0.9em; color: #888;">Horizon Ridge Credit Union &copy; ${new Date().getFullYear()}</p>
        </div>
      `,
    }),
  });

  return true;
}
