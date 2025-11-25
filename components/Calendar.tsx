// components/Calendar.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import EventCard from "./EventCard"; // Adjust path if needed
import PrintCalendarButton from "./PrintCalendarButton";

type Event = {
  id: string;
  title: string;
  date: string | null;
};

type FullEvent = Event & {
  description?: string;
  location?: string;
  image_url?: string;
};

export default function Calendar() {
  const [events, setEvents] = useState<FullEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<FullEvent | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
        return;
      }

      setEvents(data || []);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    if (selectedEvent) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus trap
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedEvent(null);
    }
  };

  const calendarEvents = events
    .filter((e): e is FullEvent & { date: string } => e.date !== null)
    .map((event) => ({
      id: event.id,
      title: event.title,
      start: event.date!,
    }));

  return (
    <div className="relative printable-calendar bg-white rounded-xl p-4">
      <PrintCalendarButton></PrintCalendarButton>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventContent={(arg) => (
          <div className="whitespace-normal break-words leading-snug text-sm text-white">
            {arg.event.title}
          </div>
        )}
        eventClick={(info) => {
          const clickedEvent = events.find((e) => e.id === info.event.id);
          if (clickedEvent) {
            setSelectedEvent(clickedEvent);
          }
        }}
        dayMaxEventRows={false}
        height="auto"
        eventColor="#ea580c"
        eventBackgroundColor="#ea580c"
        eventBorderColor="#fb923c"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        themeSystem="bootstrap"
        dayHeaderClassNames="text-stone-700 font-medium"
        dayCellClassNames="border-orange-100"
      />

      {/* Modal Overlay */}
      {selectedEvent && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-orange-900 bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 no-print"
        >
          {/* Modal Content */}
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-xl w-full relative animate-fade-in border border-orange-200 mx-4"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-2 text-stone-500 hover:text-orange-600 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 rounded transition-colors"
              aria-label="Close"
            >
              &times;
            </button>

            <EventCard event={selectedEvent} />
          </div>
        </div>
      )}
    </div>
  );
}