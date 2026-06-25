import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client - bypasses RLS, no verification needed
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    const supabase = getAdminClient();

    switch (action) {
      // Change user email using service role (bypasses verification)
      case "update-email": {
        const { userId, email } = body;
        if (!userId || !email) {
          return NextResponse.json({ error: "userId and email required" }, { status: 400 });
        }
        const { data, error } = await supabase.auth.admin.updateUserById(userId, {
          email,
          email_confirm: true, // Auto-confirm, no verification email
        });
        if (error) throw error;

        // Also update profiles table email
        await supabase.from("profiles").update({ email }).eq("id", userId);

        return NextResponse.json({ success: true, user: data.user });
      }

      // Change user password using service role
      case "update-password": {
        const { userId, password } = body;
        if (!userId || !password || password.length < 6) {
          return NextResponse.json({ error: "userId and password (min 6 chars) required" }, { status: 400 });
        }
        const { data, error } = await supabase.auth.admin.updateUserById(userId, {
          password,
        });
        if (error) throw error;
        return NextResponse.json({ success: true, user: data.user });
      }

      // Update user profile
      case "update-profile": {
        const { userId, profile } = body;
        if (!userId || !profile) {
          return NextResponse.json({ error: "userId and profile data required" }, { status: 400 });
        }
        const { error } = await supabase.from("profiles").update(profile).eq("id", userId);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      // Update account
      case "update-account": {
        const { userId, account } = body;
        if (!userId || !account) {
          return NextResponse.json({ error: "userId and account data required" }, { status: 400 });
        }
        const { error } = await supabase.from("accounts").update(account).eq("user_id", userId);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      // Upload avatar for a user
      case "upload-avatar": {
        const { userId, imageBase64, mimeType } = body;
        if (!userId || !imageBase64) {
          return NextResponse.json({ error: "userId and image required" }, { status: 400 });
        }

        const buffer = Buffer.from(imageBase64, "base64");
        const ext = (mimeType || "image/png").split("/")[1] || "png";
        const fileName = `avatars/${userId}/${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, buffer, {
            contentType: mimeType || "image/png",
            upsert: true,
          });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        const avatarUrl = urlData.publicUrl;

        // Update profile with new avatar URL
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl })
          .eq("id", userId);
        if (updateError) throw updateError;

        return NextResponse.json({ success: true, avatar_url: avatarUrl });
      }

      // Delete user completely
      case "delete-user": {
        const { userId } = body;
        if (!userId) {
          return NextResponse.json({ error: "userId required" }, { status: 400 });
        }
        // Delete related data first
        await supabase.from("login_otps").delete().eq("user_id", userId);
        await supabase.from("accounts").delete().eq("user_id", userId);
        await supabase.from("profiles").delete().eq("id", userId);
        // Delete auth user
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Admin API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
