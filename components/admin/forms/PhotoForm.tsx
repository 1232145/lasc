import React, { useState } from 'react';
import { FormWrapper } from '../ui/FormWrapper';
import { FormButtons } from '../ui/FormButtons';
import { FormField, TextInput, TextareaInput } from '../ui/FormField';
import { BatchImageInput } from '../BatchImageInput';
import type { Photo } from '../types';

interface PhotoFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBatchSubmit: (photos: Array<{
    title: string;
    description: string;
    event_title: string;
    taken_at: string;
    image_url: string;
  }>) => void;
  onCancel: () => void;
  formData: {
    title: string;
    description: string;
    event_title: string;
    taken_at: string;
    image_url: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const PhotoForm: React.FC<PhotoFormProps> = ({
  isEditing,
  onSubmit,
  onBatchSubmit,
  onCancel,
  formData,
  onFormChange
}) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);

  const handleBatchUpload = (urls: string[]) => {
    setUploadedUrls(urls);
    setIsBatchMode(urls.length > 1);
    
    if (urls.length === 1) {
      // Single photo - use existing flow
      onFormChange('image_url', urls[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBatchMode && uploadedUrls.length > 1) {
      // Batch mode - create multiple photos with shared metadata
      const photos = uploadedUrls.map(url => ({
        title: formData.title || 'Untitled Photo',
        description: formData.description,
        event_title: formData.event_title,
        taken_at: formData.taken_at,
        image_url: url
      }));
      
      onBatchSubmit(photos);
    } else {
      // Single photo mode - use existing flow
      onSubmit(e);
    }
  };

  const canSubmit = () => {
    if (isEditing) {
      return formData.title && formData.image_url;
    }
    
    if (isBatchMode) {
      return uploadedUrls.length > 0 && formData.title;
    }
    
    return formData.title && formData.image_url;
  };

  return (
    <FormWrapper 
      isEditing={isEditing} 
      title={isEditing ? "Edit Photo" : "Add Photo(s)"}
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {isBatchMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>Batch Mode:</strong> {uploadedUrls.length} photos selected. The metadata below will be applied to all photos.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isBatchMode ? "Shared Title" : "Photo Title"} required>
            <TextInput
              value={formData.title}
              onChange={(value) => onFormChange('title', value)}
              placeholder={isBatchMode ? "Title for all photos" : "Enter photo title"}
              required
            />
          </FormField>
          
          <FormField label={isBatchMode ? "Shared Event Title" : "Event Title"}>
            <TextInput
              value={formData.event_title}
              onChange={(value) => onFormChange('event_title', value)}
              placeholder="Associated event (if any)"
            />
          </FormField>
          
          <FormField label={isBatchMode ? "Shared Date" : "Taken At"}>
            <TextInput
              type="date"
              value={formData.taken_at}
              onChange={(value) => onFormChange('taken_at', value)}
            />
          </FormField>
          
          <FormField label="Photo Upload" className="md:col-span-2">
            <BatchImageInput
              folder="gallery"
              onBatchUpload={handleBatchUpload}
              label=""
              isEditing={isEditing}
              currentImageUrl={isEditing ? formData.image_url : ""}
            />
          </FormField>
          
          <FormField label={isBatchMode ? "Shared Description" : "Description"} className="md:col-span-2">
            <TextareaInput
              value={formData.description}
              onChange={(value) => onFormChange('description', value)}
              placeholder={isBatchMode ? "Description for all photos" : "Enter photo description"}
              rows={3}
            />
          </FormField>
        </div>
        
        <FormButtons 
          isEditing={isEditing} 
          onCancel={onCancel}
          submitLabel={
            isEditing 
              ? 'Update Photo' 
              : isBatchMode 
                ? `Create ${uploadedUrls.length} Photos` 
                : 'Create Photo'
          }
          disabled={!canSubmit()}
        />
      </form>
    </FormWrapper>
  );
};

