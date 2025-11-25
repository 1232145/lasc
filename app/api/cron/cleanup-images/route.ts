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
    const BUCKET = "site-images";
    const FOLDERS = ["events", "gallery", "sponsors"];
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    console.log("Starting REAL cleanup run...");

    let allFiles: { name: string; created_at: string }[] = [];

    // ---- LIST ALL FILES IN ALL FOLDERS ----
    for (const folder of FOLDERS) {
      let offset = 0;
      const pageSize = 1000;
      let more = true;

      while (more) {
        const { data, error } = await supabaseServer.storage
          .from(BUCKET)
          .list(folder, {
            limit: pageSize,
            offset,
            sortBy: {
              column: "name",
              order: "asc",
            },
          });

        if (error) {
          console.error(`Error listing folder ${folder}:`, error);
          break;
        }

        if (!data || data.length === 0) {
          more = false;
          break;
        }

        for (const file of data) {
          allFiles.push({
            name: `${folder}/${file.name}`,
            created_at: file.created_at || new Date().toISOString(),
          });
        }

        offset += data.length;
        more = data.length === pageSize;
      }
    }

    console.log(`Found ${allFiles.length} total files in bucket.`);

    // ---- COLLECT ALL IMAGE URLS IN DATABASE ----
    const tables = [
      { table: "events", column: "image_url" },
      { table: "photos", column: "image_url" },
      { table: "sponsorships", column: "logo_url" },
    ];

    const usedPaths = new Set<string>();

    for (const { table, column } of tables) {
      const { data, error } = await supabaseServer
        .from(table)
        .select(column)
        .not(column, "is", null);

      if (error) {
        console.error(`Error fetching ${table}:`, error);
        continue;
      }

      for (const row of data) {
        const url = row[column];
        if (!url) continue;

        // Extract path from URL (e.g., "site-images/events/123.jpg")
        const match = url.match(/site-images\/(.+)$/);
        if (match) {
          usedPaths.add(match[1]);
        }
      }
    }

    console.log(`Collected ${usedPaths.size} referenced image paths.`);

    // ---- REAL DELETION: Determine unused files ----
    const unused: string[] = [];

    for (const file of allFiles) {
      const createdAge = now - new Date(file.created_at).getTime();

      // Skip placeholders
      if (file.name.endsWith(".emptyFolderPlaceholder")) {
        console.log(`Skipping placeholder: ${file.name}`);
        continue;
      }

      // Skip files younger than 7 days
      if (createdAge < oneWeekMs) {
        console.log(`Skipping recent file (<7 days): ${file.name}`);
        continue;
      }

      // SAFETY: never delete folder names
      if (FOLDERS.includes(file.name)) {
        console.log(`Skipping folder name: ${file.name}`);
        continue;
      }

      // If DB does not reference this path → UNUSED
      if (!usedPaths.has(file.name)) {
        unused.push(file.name);
      }
    }

    console.log(`Preparing to delete ${unused.length} unused files...`);

    // ---- REAL DELETE ----
    for (const filePath of unused) {
      console.log(`Deleting: ${filePath}`);
      const { error } = await supabaseServer.storage.from(BUCKET).remove([filePath]);

      if (error) {
        console.error(`Failed to delete ${filePath}:`, error);
      } else {
        console.log(`Deleted: ${filePath}`);
      }
    }

    console.log("=============================");
    console.log("Cleanup COMPLETE (REAL DELETE)");
    console.log("=============================");

    return NextResponse.json(
      {
        status: "DELETE RUN COMPLETE",
        totalFiles: allFiles.length,
        referencedPaths: usedPaths.size,
        deletedCount: unused.length,
        deletedFiles: unused,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cleanup failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

