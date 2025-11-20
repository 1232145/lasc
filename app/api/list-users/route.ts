import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // For each user, fetch their role from the user_roles table
    const usersWithRoles = await Promise.all(
      data.users.map(async (user) => {
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        return {
          id: user.id,
          email: user.email,
          role: roleData?.role || "admin", // default to admin if not set
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at
        };
      })
    );

    return NextResponse.json(usersWithRoles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}