import React from 'react';
import { FormWrapper } from '../ui/FormWrapper';
import { FormButtons } from '../ui/FormButtons';
import { FormField, TextInput, TextareaInput, ImageInput } from '../ui/FormField';
import type { Photo } from '../types';

interface PhotoFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
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
  onCancel,
  formData,
  onFormChange
}) => (
  <FormWrapper 
    isEditing={isEditing} 
    title={isEditing ? "Edit Photo" : "Add New Photo"}
  >
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Photo Title" required>
          <TextInput
            value={formData.title}
            onChange={(value) => onFormChange('title', value)}
            placeholder="Enter photo title"
            required
          />
        </FormField>
        <FormField label="Event Title">
          <TextInput
            value={formData.event_title}
            onChange={(value) => onFormChange('event_title', value)}
            placeholder="Associated event (if any)"
          />
        </FormField>
        <FormField label="Taken At">
          <TextInput
            type="date"
            value={formData.taken_at}
            onChange={(value) => onFormChange('taken_at', value)}
          />
        </FormField>
        <FormField label="Photo Upload" className="md:col-span-2">
          <ImageInput
            folder="gallery"
            value={formData.image_url}
            onUpload={(url) => onFormChange('image_url', url)}
            label=""
          />
        </FormField>
        <FormField label="Description" className="md:col-span-2">
          <TextareaInput
            value={formData.description}
            onChange={(value) => onFormChange('description', value)}
            placeholder="Enter photo description"
            rows={3}
          />
        </FormField>
      </div>
      <FormButtons 
        isEditing={isEditing} 
        onCancel={onCancel}
        submitLabel={isEditing ? 'Update Photo' : 'Create Photo'}
      />
    </form>
  </FormWrapper>
);

