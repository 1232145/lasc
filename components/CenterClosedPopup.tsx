"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CenterStatus {
  id: number;
  is_closed: boolean;
  message: string | null;
}

export default function CenterClosedPopup() {
  const [status, setStatus] = useState<CenterStatus>({
    id: 1,
    is_closed: false,
    message: null,
  });

  useEffect(() => {
    // Fetch current status
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from("center_status")
        .select("id, is_closed, message")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setStatus({
          id: data.id,
          is_closed: data.is_closed,
          message: data.message,
        });
      }
    };

    fetchStatus();

    // Realtime subscription
    const channel = supabase
      .channel("public:center_status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "center_status",
          filter: "id=eq.1",
        },
        (payload) => {
          const newData = payload.new as CenterStatus;
          setStatus({
            id: newData.id,
            is_closed: newData.is_closed,
            message: newData.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!status.is_closed) return null;

  const displayMessage =
    status.message && status.message.trim() !== ""
      ? status.message
      : "Attention: The Center is Closed Today.";

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-xl border border-red-500 z-50 max-w-xl text-center font-medium">
      {displayMessage}
    </div>
  );
}