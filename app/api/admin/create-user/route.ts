import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, acctype, username, firstname, lastname, phone, ...rest } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (authError) throw authError;

    const userId = authData.user.id;

    // Create profile
    const profileData: Record<string, any> = {
      id: userId,
      full_name: username || `${firstname || ""} ${lastname || ""}`.trim() || email,
      email,
      firstname: firstname || null,
      lastname: lastname || null,
      phone: phone || null,
      ...rest,
    };
    // Remove fields not in profiles
    delete profileData.account_type;
    delete profileData.is_active;

    const { error: profileError } = await supabase.from("profiles").insert([profileData]);
    if (profileError) throw profileError;

    // Create account
    const accountNumber = "HR" + Date.now().toString().slice(-8);
    const accountType = acctype || "USD SAVING";
    const { error: accountError } = await supabase.from("accounts").insert([{
      user_id: userId,
      account_number: accountNumber,
      account_type: accountType,
      balance: 0,
      is_active: true,
    }]);
    if (accountError) throw accountError;

    return NextResponse.json({ success: true, userId, accountNumber });
  } catch (err: any) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
