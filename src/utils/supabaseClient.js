import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = import.meta.env.SUPABASE_URL || "https://wcwngxofjczpbfprrsdx.supabase.co";
const supabaseKey = import.meta.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd25neG9mamN6cGJmcHJyc2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODg1NTksImV4cCI6MjA2NzA2NDU1OX0.bK_0Xvw3AUtw-6GmOcmJxN3dyIIaQ7-Jkdo-FL-Qe5g";
export const supabase = createClient(supabaseUrl, supabaseKey);

export const RESEND_API_KEY = "re_AdmF8KcG_45C3fe3KVLg5GmUWQHXDo2Kp";