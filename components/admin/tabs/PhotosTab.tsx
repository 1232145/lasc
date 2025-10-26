import React from 'react';
import { PhotoForm } from '../forms/PhotoForm';
import { EmptyState } from '../ui/EmptyState';
import type { Photo } from '../types';

interface PhotosTabProps {
  photos: Photo[];
  editingPhoto: Photo | null;
  showCreatePhoto: boolean;
  newPhoto: any;
  sortPhotosBy: "uploaded" | "taken";
  handlePhotoFormChange: (field: string, value: string) => void;
  handleUpdatePhoto: (e: React.FormEvent) => void;
  handleCreatePhoto: (e: React.FormEvent) => void;
  handleEditPhoto: (photo: Photo) => void;
  handleDeletePhoto: (photoId: string) => void;
  setSortPhotosBy: (value: "uploaded" | "taken") => void;
  openCreatePhoto: () => void;
  closePhotoForm: () => void;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({
  photos,
  editingPhoto,
  showCreatePhoto,
  newPhoto,
  sortPhotosBy,
  handlePhotoFormChange,
  handleUpdatePhoto,
  handleCreatePhoto,
  handleEditPhoto,
  handleDeletePhoto,
  setSortPhotosBy,
  openCreatePhoto,
  closePhotoForm
}) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Photos</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer" onClick={openCreatePhoto}>
        Add New Photo
      </button>
    </div>

    {(editingPhoto !== null || showCreatePhoto) && (
      <PhotoForm
        isEditing={!!editingPhoto}
        onSubmit={editingPhoto ? handleUpdatePhoto : handleCreatePhoto}
        onCancel={closePhotoForm}
        formData={newPhoto}
        onFormChange={handlePhotoFormChange}
      />
    )}

    <div className="flex justify-end mb-4">
      <label className="mr-2 text-sm text-gray-700">Sort by:</label>
      <select
        value={sortPhotosBy}
        onChange={(e) => setSortPhotosBy(e.target.value as "uploaded" | "taken")}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
      >
        <option value="taken">Date Taken</option>
        <option value="uploaded">Date Uploaded</option>
      </select>
    </div>

    {photos.length === 0 ? (
      <EmptyState message="No photos found." />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {photos
          .slice()
          .sort((a, b) => {
            const aDate = new Date(String(sortPhotosBy === "taken" ? a.taken_at : a.created_at));
            const bDate = new Date(String(sortPhotosBy === "taken" ? b.taken_at : b.created_at));
            return bDate.getTime() - aDate.getTime();
          })
          .map(photo => (
            <div key={photo.id} className="bg-white border rounded-lg shadow-sm p-4">
              <img src={photo.image_url} alt={photo.title} className="w-full h-48 object-cover rounded mb-2" />
              <h3 className="font-semibold text-gray-800">{photo.title}</h3>
              <p className="text-sm text-gray-600 truncate">{photo.description}</p>
              <p className="text-xs text-gray-400">Taken: {photo.taken_at?.split("T")[0]}</p>
              <div className="flex justify-end space-x-2 mt-3">
                <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEditPhoto(photo)}>Edit</button>
                <button className="text-red-600 hover:underline text-sm" onClick={() => handleDeletePhoto(photo.id)}>Delete</button>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
);

