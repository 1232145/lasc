import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_KEY) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    const results: { task: string; status: number; body: string }[] = [];

    // Always run: reset-center-status
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
    const resetText = await resetRes.text();
    results.push({ task: "reset-center-status", status: resetRes.status, body: resetText });

    // Check if today is Monday (0=Sunday, 1=Monday, …)
    const now = new Date();
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 1) {
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
      const cleanupText = await cleanupRes.text();
      results.push({ task: "cleanup-images", status: cleanupRes.status, body: cleanupText });
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}