// components/Calendar.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Event = {
    id: string;
    title: string;
    date: string | null;
};

export default function Calendar() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from("events")
                .select("id, title, date")
                .order("date", { ascending: true });

            if (error) {
                console.error("Error fetching events:", error);
                return;
            }

            setEvents(data || []);
        };

        fetchEvents();
    }, []);

    // Format for FullCalendar
    const calendarEvents = events
        .filter((e) => !!e.date)
        .map((event) => ({
            id: event.id,
            title: event.title,
            start: event.date,
        }));

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventContent={(arg) => (
                <div className="whitespace-normal break-words leading-snug text-sm">
                    {arg.event.title}
                </div>
            )}
            dayMaxEventRows={false}
            height="auto"
            eventColor="#1e40af" // Tailwind's blue-900
        />
    );
}