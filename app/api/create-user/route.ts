import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for privileged actions
);

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json(); // password removed because invite doesn't use it

    if (!email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create the user in Supabase Auth via invite
    // This sends a magic-link email allowing the user to set a password
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const redirectTo = `${siteUrl}/set-password`;
    const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo
    });

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }

    if (!data || !data.user) {
      return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

    const newUserId = data.user.id;

    // 2. Insert the user's role in user_roles table
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert([{ user_id: newUserId, role }]);

    if (roleError) {
      // Attempt to delete the created user to keep DB consistent
      await supabase.auth.admin.deleteUser(newUserId);

      return NextResponse.json({
        error: `User created but failed to assign role: ${roleError.message}`,
      }, { status: 500 });
    }

    return NextResponse.json({ message: "User created", user: data.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}