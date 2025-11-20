import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, newRole } = await request.json(); // newRole is optional; if provided, we're updating role

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // Fetch the user's current role
    const { data: roleData, error: roleFetchError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roleFetchError) {
      return NextResponse.json(
        { error: `Failed to fetch user role: ${roleFetchError.message}` },
        { status: 400 }
      );
    }

    // Count number of root users
    const { count: rootCount, error: countError } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "root");

    if (countError) {
      return NextResponse.json(
        { error: `Failed to count root users: ${countError.message}` },
        { status: 400 }
      );
    }

    // Prevent deletion or demotion of last root
    if (roleData?.role === "root" && (rootCount ?? 0) <= 1) {
      // If trying to delete (no newRole provided) or demote
      if (!newRole || newRole !== "root") {
        return NextResponse.json(
          { error: "Cannot delete or demote the last root user" },
          { status: 400 }
        );
      }
    }

    // If newRole is provided, update role instead of deletion
    if (newRole) {
      const { error: updateError } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (updateError) {
        return NextResponse.json(
          { error: `Failed to update role: ${updateError.message}` },
          { status: 400 }
        );
      }

      return NextResponse.json({ message: "User role updated successfully" });
    }

    // Delete from user_roles first
    const { error: roleError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (roleError) {
      return NextResponse.json(
        { error: `Failed to delete user role: ${roleError.message}` },
        { status: 400 }
      );
    }

    // Delete user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      return NextResponse.json(
        { error: `Failed to delete auth user: ${authError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "User deleted successfully" });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}