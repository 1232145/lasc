import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const redirectTo = `${siteUrl}/reset-password`;

    // Send password reset email
    const { error } = await supabaseServer.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Don't reveal if user exists or not for security
    return NextResponse.json({ 
      message: "If an account exists with this email, a password reset link has been sent." 
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

