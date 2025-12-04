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
  existingCategories?: string[];
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  isEditing,
  onSubmit,
  onCancel,
  title,
  formData,
  onFormChange,
  existingCategories = []
}) => {
  const handleCategoryChange = (value: string) => {
    // Allow typing with spaces, trim will happen on save
    onFormChange('category', value);
  };

  const handleCategorySelect = (category: string) => {
    onFormChange('category', category);
  };

  return (
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
          <FormField label="Category" required>
            <div className="flex gap-2">
              <TextInput
                value={formData.category}
                onChange={handleCategoryChange}
                placeholder="e.g. Health, Transportation, Social Services"
                required
                className="flex-1"
              />
              {existingCategories.length > 0 && (
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleCategorySelect(e.target.value);
                      }
                    }}
                    className="px-3 py-2 pr-8 border border-orange-300 rounded-lg bg-white text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 focus:text-stone-900 transition-colors appearance-none cursor-pointer w-full"
                    title="Select existing category"
                  >
                    <option value="" disabled>Select...</option>
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
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
};

