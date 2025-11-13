"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/contexts/ToastContext";

export default function AdminCenterToggle() {
  const [isClosed, setIsClosed] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");
  const [showMessageInput, setShowMessageInput] = useState(false);
  const { showSuccess, showError } = useToast();

  // Fetch current status + message
  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from("center_status")
        .select("is_closed, message")
        .eq("id", 1)
        .single();

      if (error) {
        showError("Error fetching center status", error.message);
        return;
      }

      setIsClosed(data.is_closed);
      setMessage(data.message || "");
    };

    fetchStatus();
  }, [showError]);

  // Handles main button click
  const handleToggleClick = () => {
    if (isClosed === null) return;

    if (!isClosed) {
      // Currently open → intent to close → show message input
      setShowMessageInput(true);
    } else {
      // Currently closed → mark as open immediately
      toggleStatus(false, null);
    }
  };

  // Updates the database
  const toggleStatus = async (closing: boolean, msg: string | null) => {
    const { error } = await supabase
      .from("center_status")
      .update({
        is_closed: closing,
        updated_at: new Date(),
        message: closing ? msg : null, // clear message when opening
      })
      .eq("id", 1);

    if (error) {
      showError("Error updating status", error.message);
      return;
    }

    setIsClosed(closing);
    setMessage(""); // clear local message
    setShowMessageInput(false);

    showSuccess(
      "Center status updated",
      `Center is now ${closing ? "CLOSED" : "OPEN"}`
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleToggleClick}
          className={`px-4 py-2 font-bold rounded ${
            isClosed ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {isClosed === null
            ? "Loading..."
            : isClosed
            ? "Mark Center as Open"
            : "Mark Center as Closed"}
        </button>
      </div>

      {showMessageInput && (
        <div className="flex flex-col space-y-2 mt-2">
          <label htmlFor="center-message" className="font-medium text-gray-700">
            Optional message for popup:
          </label>
          <input
            type="text"
            id="center-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            placeholder="Attention: The Center is Closed Today."
          />
          <div className="flex space-x-2">
            <button
              onClick={() => toggleStatus(true, message)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowMessageInput(false);
                setMessage("");
              }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}