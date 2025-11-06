import React from 'react';
import { FormWrapper } from '../ui/FormWrapper';
import { FormButtons } from '../ui/FormButtons';
import { FormField, TextInput, TextareaInput, ImageInput } from '../ui/FormField';
import type { Event } from '../types';

interface EventFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
  formData: {
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    capacity: string;
    image_url: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const EventForm: React.FC<EventFormProps> = ({
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
        <FormField label="Event Title" required>
          <TextInput
            value={formData.title}
            onChange={(value) => onFormChange('title', value)}
            placeholder="Enter event title"
            required
          />
        </FormField>
        <FormField label="Date" required>
          <TextInput
            type="date"
            value={formData.date}
            onChange={(value) => onFormChange('date', value)}
            required
          />
        </FormField>
        <FormField label="Start Time">
          <TextInput
            type="time"
            value={formData.start_time}
            onChange={(value) => onFormChange('start_time', value)}
          />
        </FormField>
        <FormField label="End Time">
          <TextInput
            type="time"
            value={formData.end_time}
            onChange={(value) => onFormChange('end_time', value)}
          />
        </FormField>
        <FormField label="Location">
          <TextInput
            value={formData.location}
            onChange={(value) => onFormChange('location', value)}
            placeholder="Enter event location"
          />
        </FormField>
        <FormField label="Capacity">
          <TextInput
            type="number"
            value={formData.capacity}
            onChange={(value) => onFormChange('capacity', value)}
            placeholder="Enter maximum capacity"
            className="[&::-webkit-inner-spin-button]:appearance-none"
          />
        </FormField>
        <FormField label="Event Image Upload">
          <ImageInput
            folder="events"
            value={formData.image_url}
            onUpload={(url) => onFormChange("image_url", url)}
            label=""
          />
        </FormField>
        <FormField label="Description" className="md:col-span-2">
          <TextareaInput
            value={formData.description}
            onChange={(value) => onFormChange('description', value)}
            placeholder="Enter event description"
            rows={3}
          />
        </FormField>
      </div>
      <FormButtons
        isEditing={isEditing}
        onCancel={onCancel}
        submitLabel={isEditing ? 'Update Event' : 'Create Event'}
      />
    </form>
  </FormWrapper>
);

