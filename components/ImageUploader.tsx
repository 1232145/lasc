"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ImageUploaderProps {
    folder: "events" | "sponsors" | "gallery"; // limits to your three folders
    value?: string; // current image URL (if editing)
    onUpload: (url: string) => void; // callback to update parent form
    label?: string;
}

export default function ImageUploader({ folder, value, onUpload, label }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            const ext = file.name.split(".").pop();
            const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
            const filePath = `${folder}/${uniqueName}`;

            // Upload to Supabase
            const { error } = await supabase.storage
                .from("site-images")
                .upload(filePath, file, {
                    contentType: file.type,
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data } = supabase.storage.from("site-images").getPublicUrl(filePath);

            onUpload(data.publicUrl);
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        if (confirm("Remove this image?")) {
            onUpload("");
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div>
                <button
                    type="button"
                    onClick={() => document.getElementById(`file-input-${folder}`)?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    {uploading ? "Uploading..." : value ? "Change Image" : "Choose Image"}
                </button>

                <input
                    type="file"
                    accept="image/*"
                    id={`file-input-${folder}`}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {value && (
                <div className="mt-2">
                    <img
                        src={value}
                        alt="Uploaded preview"
                        className="h-24 rounded-md object-cover border"
                    />
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500 break-all truncate w-5/6">{value}</p>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-xs text-red-600 hover:text-red-800"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}