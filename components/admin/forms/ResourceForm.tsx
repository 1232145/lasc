import React from 'react';
import { FormWrapper } from '../ui/FormWrapper';
import { FormButtons } from '../ui/FormButtons';
import { FormField, TextInput, TextareaInput } from '../ui/FormField';
import type { Resource } from '../types';

interface ResourceFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
  formData: {
    title: string;
    description: string;
    url: string;
    category: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
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
        <FormField label="Resource Title" required>
          <TextInput
            value={formData.title}
            onChange={(value) => onFormChange('title', value)}
            placeholder="Enter resource title"
            required
          />
        </FormField>
        <FormField label="Category">
          <TextInput
            value={formData.category}
            onChange={(value) => onFormChange('category', value)}
            placeholder="e.g. Health, Transportation, Social Services"
          />
        </FormField>
        <FormField label="URL" required className="md:col-span-2">
          <TextInput
            type="url"
            value={formData.url}
            onChange={(value) => onFormChange('url', value)}
            placeholder="https://example.com"
            required
          />
        </FormField>
        <FormField label="Description" className="md:col-span-2">
          <TextareaInput
            value={formData.description}
            onChange={(value) => onFormChange('description', value)}
            placeholder="Enter resource description"
            rows={3}
          />
        </FormField>
      </div>
      <FormButtons 
        isEditing={isEditing} 
        onCancel={onCancel}
        submitLabel={isEditing ? 'Update Resource' : 'Create Resource'}
      />
    </form>
  </FormWrapper>
);

