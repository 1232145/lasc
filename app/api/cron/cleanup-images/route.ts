import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // optional, can also be "nodejs"

export async function POST(req: NextRequest) {
  try {
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_KEY) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    const res = await fetch(
      "https://biymlkhzjdwablqvkcma.supabase.co/functions/v1/cleanup-images",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const text = await res.text();
    return NextResponse.json({ status: res.status, body: text });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}