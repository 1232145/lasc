import React from 'react';

interface FormButtonsProps {
  isEditing: boolean;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export const FormButtons: React.FC<FormButtonsProps> = ({ 
  isEditing, 
  onCancel, 
  submitLabel, 
  cancelLabel = 'Cancel' 
}) => (
  <div className="flex justify-end space-x-3">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
    >
      {cancelLabel}
    </button>
    <button
      type="submit"
      className={`px-4 py-2 text-white rounded-md cursor-pointer ${
        isEditing
          ? 'bg-yellow-600 hover:bg-yellow-700'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {submitLabel || (isEditing ? 'Update' : 'Create')}
    </button>
  </div>
);

