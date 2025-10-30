import React from 'react';
import { FormWrapper } from '../ui/FormWrapper';
import { FormButtons } from '../ui/FormButtons';
import { FormField, TextInput, TextareaInput, ImageInput } from '../ui/FormField';
import type { Sponsor } from '../types';

interface SponsorFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
  formData: {
    name: string;
    logo_url: string;
    description: string;
    website: string;
    order_index: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const SponsorForm: React.FC<SponsorFormProps> = ({
  isEditing,
  onSubmit,
  onCancel,
  title,
  formData,
  onFormChange
}) => (
  <FormWrapper isEditing={isEditing} title={title}>
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Sponsor Name" required>
          <TextInput
            value={formData.name}
            onChange={(value) => onFormChange('name', value)}
            placeholder="Enter sponsor name"
            required
          />
        </FormField>
        <FormField label="Sponsor Logo" className="md:col-span-2">
          <ImageInput
            folder="sponsors"
            value={formData.logo_url}
            onUpload={(url) => onFormChange('logo_url', url)}
            label=""
          />
        </FormField>
        <FormField label="Website URL">
          <TextInput
            type="url"
            value={formData.website}
            onChange={(value) => onFormChange('website', value)}
            placeholder="https://example.com"
          />
        </FormField>
        <FormField label="Description" className="md:col-span-2">
          <TextareaInput
            value={formData.description}
            onChange={(value) => onFormChange('description', value)}
            placeholder="Enter sponsor description"
            rows={3}
          />
        </FormField>
      </div>
      <FormButtons 
        isEditing={isEditing} 
        onCancel={onCancel}
        submitLabel={isEditing ? 'Update Sponsor' : 'Create Sponsor'}
      />
    </form>
  </FormWrapper>
);

