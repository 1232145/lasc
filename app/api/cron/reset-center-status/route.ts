import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(request: Request) {
  // Verify this is called from Vercel Cron (optional security check)
  // If CRON_SECRET is set, require it; otherwise allow (Vercel Cron is already protected)
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // --- EST midnight calculation ---
    const now = new Date();
    
    // Convert UTC to EST/EDT automatically
    // 'America/New_York' accounts for DST
    const estTime = now.toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    const estDate = new Date(estTime);

    // Only reset if current hour is midnight EST
    if (estDate.getHours() !== 0) {
      return NextResponse.json({
        success: false,
        message: "Not midnight EST, skipping reset",
        estHour: estDate.getHours(),
      });
    }

    // Update the center_status and message rows
    const { data, error } = await supabaseServer
      .from("center_status")
      .update({
        is_closed: false,
        message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1); // your single-row ID

    if (error) {
      console.error("Error updating center_status:", error.message);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log("Successfully reset center_status:", data);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

