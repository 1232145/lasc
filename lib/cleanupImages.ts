import { supabase } from "@/lib/supabaseClient";

const tablesWithImages = [
    { table: "events", column: "image_url" },
    { table: "photos", column: "image_url" },
    { table: "sponsorships", column: "logo_url" },
];

export async function cleanupImages() {
    console.log("Starting cleanup...");

    try {
        // Fetch all files in the bucket with pagination
        const files: { name: string; created_at: string }[] = [];
        const pageSize = 1000;
        let offset = 0;
        let moreFiles = true;

        while (moreFiles) {
            const { data: batch, error } = await supabase.storage
                .from("site-images")
                .list("", { limit: pageSize, offset, sortBy: { column: "name", order: "asc" } });

            if (error) {
                console.error("Error listing files:", error);
                return;
            }

            if (batch && batch.length > 0) {
                files.push(...batch);
                offset += batch.length;
            } else {
                moreFiles = false;
            }

            if (!batch || batch.length < pageSize) moreFiles = false;
        }

        if (files.length === 0) {
            console.log("No files found in bucket.");
            return;
        }

        // Build a set of all URLs currently used in the database
        const usedUrls = new Set<string>();

        for (const { table, column } of tablesWithImages) {
            const { data, error } = await supabase.from(table).select(column);
            if (error) {
                console.error(`Error fetching ${table}:`, error);
                continue;
            }

            (data as Record<string, any>[]).forEach((row) => {
                const url = row[column];
                if (url) usedUrls.add(url);
            });
        }

        // Grace period: 24 hours
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const now = new Date().getTime();

        // Iterate through files and delete unused ones older than 24 hours
        for (const file of files) {
            const createdAt = new Date(file.created_at).getTime();

            if (now - createdAt < ONE_DAY_MS) {
                console.log(`Skipping recent file (within 24h): ${file.name}`);
                continue; // Skip files within grace period
            }

            const publicUrl = supabase.storage.from("site-images").getPublicUrl(file.name).data.publicUrl;
            if (!usedUrls.has(publicUrl)) {
                const { error } = await supabase.storage.from("site-images").remove([file.name]);
                if (error) {
                    console.error(`Error deleting file ${file.name}:`, error);
                } else {
                    console.log(`Deleted unused file: ${file.name}`);
                }
            }
        }

        console.log("Cleanup complete!");
    } catch (err) {
        console.error("Cleanup failed:", err);
    }
}