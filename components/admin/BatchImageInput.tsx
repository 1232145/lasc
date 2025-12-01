"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Upload, Plus, Image } from "lucide-react";

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
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Filter for image files only
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select only image files.');
      return;
    }

    setSelectedFiles(prev => [...prev, ...imageFiles]);
    
    // Create previews for new files
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    // Clean up the removed preview URL
    URL.revokeObjectURL(previews[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearAll = () => {
    // Clean up all preview URLs
    previews.forEach(preview => URL.revokeObjectURL(preview));
    setSelectedFiles([]);
    setPreviews([]);
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
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : selectedFiles.length > 0 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            {selectedFiles.length > 0 ? (
              <Image className="mx-auto h-12 w-12 text-green-500" />
            ) : (
              <Upload className="mx-auto h-12 w-12" />
            )}
          </div>
          
          {selectedFiles.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Photos
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop photos here, or click to browse
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                <Plus className="mr-2 h-4 w-4" />
                Select Photos
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-green-700 mb-2">
                {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''} Ready
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Add more photos or upload these to continue
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-200"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add More
                </button>
                <button
                  type="button"
                  onClick={uploadFiles}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Photo${selectedFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={!isEditing}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* File Management */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Selected Photos ({selectedFiles.length})
            </span>
            <button
              type="button"
              onClick={clearAll}
              disabled={uploading}
              className="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:bg-gray-400"
                >
                  <X size={14} />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate text-center">
                  {selectedFiles[index].name}
                </p>
              </div>
            ))}
          </div>

          {/* Upload Progress Info */}
          {uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm flex items-center">
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Uploading photos... Please don't close this page.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• {isEditing ? "Select a single photo" : "Select multiple photos for batch upload"}</p>
        <p>• Supported formats: JPG, PNG, GIF, WebP, HEIC</p>
        <p>• HEIC files will be automatically converted to JPG</p>
        {!isEditing && <p>• You can add more photos before uploading</p>}
      </div>
    </div>
  );
};