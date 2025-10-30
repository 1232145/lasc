import React from 'react';
import { FormWrapper } from '../ui/FormWrapper';
import { FormButtons } from '../ui/FormButtons';
import { FormField, TextInput } from '../ui/FormField';
import type { BoardMember } from '../types';

interface BoardMemberFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formData: {
    name: string;
    role: string;
    order_index: string;
    email: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const BoardMemberForm: React.FC<BoardMemberFormProps> = ({
  isEditing,
  onSubmit,
  onCancel,
  formData,
  onFormChange
}) => (
  <FormWrapper 
    isEditing={isEditing} 
    title={isEditing ? "Edit Board Member" : "Add New Board Member"}
  >
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Name" required>
          <TextInput
            value={formData.name}
            onChange={(value) => onFormChange("name", value)}
            required
            placeholder="Full Name"
          />
        </FormField>
        <FormField label="Role" required>
          <TextInput
            value={formData.role}
            onChange={(value) => onFormChange("role", value)}
            required
            placeholder="President, Treasurer, etc."
          />
        </FormField>
        <FormField label="Email Address">
          <TextInput
            value={formData.email}
            onChange={(value) => onFormChange("email", value)}
            placeholder="SomeAddress@email.com"
          />
        </FormField>
      </div>
      <FormButtons 
        isEditing={isEditing} 
        onCancel={onCancel}
        submitLabel={isEditing ? "Update Member" : "Create Member"}
      />
    </form>
  </FormWrapper>
);

