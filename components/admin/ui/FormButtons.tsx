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
      className="btn-secondary px-4 py-2 border-2 border-orange-300 rounded-lg text-stone-700 bg-white hover:bg-orange-50 hover:border-orange-400 cursor-pointer transition-all duration-300"
    >
      {cancelLabel}
    </button>
    <button
      type="submit"
      className={`btn-primary px-4 py-2 text-white rounded-lg cursor-pointer font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
        isEditing
          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700'
          : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
      }`}
    >
      {submitLabel || (isEditing ? 'Update' : 'Create')}
    </button>
  </div>
);

