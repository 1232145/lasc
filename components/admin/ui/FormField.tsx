import React from 'react';
import ImageUploader from '@/components/ImageUploader';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  required = false, 
  children, 
  className = '' 
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    {children}
  </div>
);

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = 'text',
  className = ''
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100 ${className}`}
    placeholder={placeholder}
    required={required}
  />
);

interface TextareaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export const TextareaInput: React.FC<TextareaInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  rows = 3,
  className = ''
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100 ${className}`}
    placeholder={placeholder}
    rows={rows}
  />
);

interface ImageInputProps {
  folder: "events" | "sponsors" | "gallery";
  value: string;
  onUpload: (url: string) => void;
  label: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({ folder, value, onUpload, label }) => (
  <ImageUploader
    folder={folder}
    value={value}
    onUpload={onUpload}
    label={label}
  />
);

