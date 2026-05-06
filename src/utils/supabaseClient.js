import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables are required');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const RESEND_API_KEY = "re_3eWB6JZT_ExkG36wkGjsdY9zezVsRWhDv";