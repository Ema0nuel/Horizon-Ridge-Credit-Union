import { supabase } from '../../../utils/supabaseClient';
import { findUserByAccessID } from './loginHandler';

export async function verifyOtp(accessID, otp) {
    const userData = await findUserByAccessID(accessID);

    if (!userData || !userData.id) {
        throw new Error("User not found. Please use a valid email address or account number.");
    }

    // Find valid OTP
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

    // Mark OTP as used
    const { error: updateError } = await supabase
        .from("login_otps")
        .update({ used: true, temp_password: null })
        .eq("id", otpData.id);

    if (updateError) {
        throw new Error("Could not verify OTP. Please try again.");
    }

    // User already authenticated from loginAndSendOtp — no second signInWithPassword needed.
    // Get existing session.
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error("Session expired. Please log in again.");
    }

    await supabase.auth.setSession(session);
    return true;
}