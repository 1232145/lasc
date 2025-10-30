import React from 'react';

interface FormWrapperProps {
  isEditing: boolean;
  title: string;
  children: React.ReactNode;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({ isEditing, title, children }) => (
  <div className={`p-6 rounded-lg mb-6 border ${isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

