import { NextResponse } from "next/server";

// ❗ Must be Edge runtime for Vercel Cron on Free tier
export const runtime = "edge";

// ❗ Vercel Cron sends GET, not POST
export async function GET() {
  try {
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_KEY) {
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const results: { task: string; status: number }[] = [];

    // --- Always run reset-center-status ---
    const resetRes = await fetch(
      "https://biymlkhzjdwablqvkcma.supabase.co/functions/v1/reset-center-status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    results.push({ task: "reset-center-status", status: resetRes.status });

    // --- Check if today is Monday in America/New_York ---
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    if (now.getDay() === 1) {
      // Only run cleanup-images on Mondays
      const cleanupRes = await fetch(
        "https://biymlkhzjdwablqvkcma.supabase.co/functions/v1/cleanup-images",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      results.push({ task: "cleanup-images", status: cleanupRes.status });
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}