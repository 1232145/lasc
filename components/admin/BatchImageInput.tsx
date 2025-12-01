"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Upload } from "lucide-react";

interface BatchImageInputProps {
  folder: "events" | "sponsors" | "gallery";
  onBatchUpload: (urls: string[]) => void;
  label: string;
  isEditing?: boolean;
  currentImageUrl?: string;
}

export const BatchImageInput: React.FC<BatchImageInputProps> = ({ 
  folder, 
  onBatchUpload, 
  label,
  isEditing = false,
  currentImageUrl = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Clean up the removed preview URL
    URL.revokeObjectURL(previews[index]);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let file of selectedFiles) {
        // Auto-convert HEIC → JPEG
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
          const heic2any = (await import("heic2any")).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9,
          });

          file = new File([convertedBlob as Blob], file.name.replace(/\.heic$/i, ".jpg"), {
            type: "image/jpeg",
          });
        }

        const ext = file.name.split(".").pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const filePath = `${folder}/${uniqueName}`;

        // Upload to Supabase
        const { error } = await supabase.storage
          .from("site-images")
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (error) throw error;

        // Get public URL
        const { data } = supabase.storage.from("site-images").getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      // Clean up previews
      previews.forEach(preview => URL.revokeObjectURL(preview));
      
      // Reset state
      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onBatchUpload(uploadedUrls);
    } catch (err) {
      console.error("Error uploading files:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // For editing mode, show current image
  if (isEditing && currentImageUrl && selectedFiles.length === 0) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-2">
          <img
            src={currentImageUrl}
            alt="Current photo"
            className="h-24 rounded-md object-cover border"
          />
          <p className="text-xs text-gray-500 mt-1">Current photo (editing single photos only)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-400"
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : selectedFiles.length > 0 ? `Upload ${selectedFiles.length} Photos` : "Choose Photos"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={!isEditing}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <p className="text-xs text-gray-500 mt-1">
          {isEditing ? "Select a single photo" : "Select multiple photos to upload at once. HEIC files will be converted."}
        </p>
      </div>

      {/* Photo Previews */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              onClick={uploadFiles}
              disabled={uploading}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {uploading ? "Uploading..." : "Upload All"}
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-16 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 disabled:bg-gray-400"
                >
                  <X size={12} />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {selectedFiles[index].name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};