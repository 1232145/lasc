import React from 'react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <p className="text-stone-500 dark:text-stone-400 text-center py-8">{message}</p>
);

