import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with admin privileges (service role key)
// Use this in API routes that need admin operations

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please set SUPABASE_SERVICE_ROLE_KEY.");
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

