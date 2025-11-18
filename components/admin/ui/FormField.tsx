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
    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
      {label} {required && <span className="text-orange-600 dark:text-orange-400">*</span>}
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
    className={`w-full border border-orange-300 dark:border-stone-600 rounded-lg px-3 py-2 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors ${className}`}
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
    className={`w-full border border-orange-300 dark:border-stone-600 rounded-lg px-3 py-2 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors resize-vertical ${className}`}
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

