"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Upload, Image, CheckCircle, AlertCircle } from "lucide-react";

interface BatchPhotoUploaderProps {
  onBatchComplete: (photos: Array<{
    title: string;
    description: string;
    event_title: string;
    taken_at: string;
    image_url: string;
  }>) => void;
  onCancel: () => void;
  defaultEventTitle?: string;
  defaultTakenAt?: string;
}

interface UploadedPhoto {
  id: string;
  file: File;
  title: string;
  description: string;
  event_title: string;
  taken_at: string;
  image_url: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  preview?: string;
}

export const BatchPhotoUploader: React.FC<BatchPhotoUploaderProps> = ({
  onBatchComplete,
  onCancel,
  defaultEventTitle = '',
  defaultTakenAt = ''
}) => {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newPhotos: UploadedPhoto[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for title
      description: '',
      event_title: defaultEventTitle,
      taken_at: defaultTakenAt,
      image_url: '',
      uploading: false,
      uploaded: false,
      preview: URL.createObjectURL(file)
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    
    // Clear the input so the same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updatePhoto = (id: string, updates: Partial<UploadedPhoto>) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, ...updates } : photo
    ));
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const uploadSinglePhoto = async (photo: UploadedPhoto): Promise<string> => {
    let file = photo.file;

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
    const filePath = `gallery/${uniqueName}`;

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
    return data.publicUrl;
  };

  const handleBatchUpload = async () => {
    if (photos.length === 0) return;

    setUploading(true);

    // Upload all photos
    const uploadPromises = photos.map(async (photo) => {
      if (photo.uploaded) return photo;

      updatePhoto(photo.id, { uploading: true, error: undefined });

      try {
        const imageUrl = await uploadSinglePhoto(photo);
        updatePhoto(photo.id, { 
          uploading: false, 
          uploaded: true, 
          image_url: imageUrl 
        });
        return { ...photo, image_url: imageUrl, uploaded: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updatePhoto(photo.id, { 
          uploading: false, 
          error: errorMessage 
        });
        return photo;
      }
    });

    const results = await Promise.all(uploadPromises);
    
    // Filter out successful uploads
    const successfulUploads = results
      .filter(photo => photo.uploaded && photo.image_url)
      .map(photo => ({
        title: photo.title,
        description: photo.description,
        event_title: photo.event_title,
        taken_at: photo.taken_at,
        image_url: photo.image_url
      }));

    setUploading(false);

    if (successfulUploads.length > 0) {
      onBatchComplete(successfulUploads);
    }
  };

  const hasValidPhotos = photos.some(photo => !photo.error);
  const allUploaded = photos.length > 0 && photos.every(photo => photo.uploaded || photo.error);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Batch Photo Upload</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* File Selection */}
          <div className="mb-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <Upload size={20} />
              Select Photos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              Select multiple photos to upload at once. HEIC files will be automatically converted to JPEG.
            </p>
          </div>

          {/* Photos List */}
          {photos.length > 0 && (
            <div className="space-y-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Preview */}
                    <div className="relative">
                      <img
                        src={photo.preview}
                        alt={photo.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      {photo.uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {photo.uploaded && (
                        <div className="absolute -top-2 -right-2">
                          <CheckCircle size={20} className="text-green-600 bg-white rounded-full" />
                        </div>
                      )}
                      {photo.error && (
                        <div className="absolute -top-2 -right-2">
                          <AlertCircle size={20} className="text-red-600 bg-white rounded-full" />
                        </div>
                      )}
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={photo.title}
                          onChange={(e) => updatePhoto(photo.id, { title: e.target.value })}
                          disabled={photo.uploading || photo.uploaded}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                        <input
                          type="text"
                          value={photo.event_title}
                          onChange={(e) => updatePhoto(photo.id, { event_title: e.target.value })}
                          disabled={photo.uploading || photo.uploaded}
                          placeholder="Associated event (optional)"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Taken At</label>
                        <input
                          type="date"
                          value={photo.taken_at}
                          onChange={(e) => updatePhoto(photo.id, { taken_at: e.target.value })}
                          disabled={photo.uploading || photo.uploaded}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={photo.description}
                          onChange={(e) => updatePhoto(photo.id, { description: e.target.value })}
                          disabled={photo.uploading || photo.uploaded}
                          placeholder="Photo description (optional)"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removePhoto(photo.id)}
                      disabled={photo.uploading}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {photo.error && (
                    <p className="text-sm text-red-600 mt-2">Error: {photo.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={uploading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBatchUpload}
              disabled={!hasValidPhotos || uploading || allUploaded}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {uploading ? 'Uploading...' : allUploaded ? 'Complete' : `Upload ${photos.length} Photos`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};