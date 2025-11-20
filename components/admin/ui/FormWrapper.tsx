import React from 'react';

interface FormWrapperProps {
  isEditing: boolean;
  title: string;
  children: React.ReactNode;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({ isEditing, title, children }) => (
  <div className={`p-6 rounded-xl mb-6 border transition-all duration-300 ${
    isEditing 
      ? 'bg-amber-50 border-amber-200' 
      : 'bg-orange-50 border-orange-200'
  }`}>
    <h3 className="text-lg font-semibold text-stone-900 mb-4">{title}</h3>
    {children}
  </div>
);

