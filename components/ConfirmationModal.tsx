"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger"
}: ConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-500",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200"
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
          border: "border-yellow-200"
        };
      case "info":
        return {
          icon: "text-blue-500",
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
          border: "border-blue-200"
        };
      default:
        return {
          icon: "text-red-500",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200"
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className={`px-6 py-4 border-b ${styles.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
