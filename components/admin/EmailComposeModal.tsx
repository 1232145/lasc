"use client";

import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";

interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, body: string) => Promise<void>;
  eventTitle: string;
  recipientCount: number;
}

export function EmailComposeModal({
  isOpen,
  onClose,
  onSend,
  eventTitle,
  recipientCount
}: EmailComposeModalProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Pre-fill subject with event title
      setSubject(`Update: ${eventTitle}`);
      setBody(`Hi {name},\n\n\n\nBest regards,\nLASC Team`);
    } else {
      document.body.style.overflow = "unset";
      // Reset form when closing
      setSubject("");
      setBody("");
      setError(null);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, eventTitle]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim()) {
      setError("Subject is required");
      return;
    }

    if (!body.trim()) {
      setError("Email body is required");
      return;
    }

    setLoading(true);
    try {
      await onSend(subject.trim(), body.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send emails");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Send Email to RSVPs
                  </h3>
                  <p className="text-sm text-gray-500">
                    {eventTitle} • {recipientCount} recipient{recipientCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject *
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Email subject"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={loading}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
                  placeholder="Email body (use {name} to personalize)"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tip: Use {"{name}"} in your message to personalize each email
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !subject.trim() || !body.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : `Send to ${recipientCount} recipient${recipientCount !== 1 ? "s" : ""}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

