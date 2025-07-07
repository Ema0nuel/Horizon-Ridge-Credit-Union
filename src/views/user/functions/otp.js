import { supabase } from '../../../utils/supabaseClient';

export async function verifyOtp(accessID, otp) {
    // Find user
    const { data: userData } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .or(`email.eq.${accessID},username.eq.${accessID}`)
        .maybeSingle();

    // Find OTP
    const { data: otpData } = await supabase
        .from("login_otps")
        .select("*")
        .eq("user_id", userData.id)
        .eq("otp", otp)
        .eq("used", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (!otpData || new Date(otpData.expires_at) < new Date()) {
        throw new Error("Invalid or expired OTP.");
    }

    // Mark OTP as used
    await supabase.from("login_otps").update({ used: true }).eq("id", otpData.id);

    // Issue session token: sign in again to get session
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: otpData.temp_password
    });

    // Remove temp_password for security
    await supabase.from("login_otps").update({ temp_password: null }).eq("id", otpData.id);

    if (authError || !authData?.session) {
        throw new Error("Session could not be created.");
    }

    // Set session in browser
    await supabase.auth.setSession(authData.session);
    return true;
}