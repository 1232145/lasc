import React from 'react';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
    <button
      onClick={onEdit}
      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
    >
      Edit
    </button>
    <button
      onClick={onDelete}
      className="text-red-600 hover:text-red-900 cursor-pointer"
    >
      Delete
    </button>
  </td>
);

