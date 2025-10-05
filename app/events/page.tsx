import { supabase } from "@/lib/supabaseClient";
import EventCard from "@/components/EventCard";
import RSVPForm from "./RSVPForm";

export default async function EventsPage() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    return (
      <section className="py-16 text-center text-gray-600">
        <p>Unable to load events right now. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          RSVP & Upcoming Events
        </h1>

        {/* RSVP Form on top */}
        <RSVPForm />

        <hr className="my-10 border-gray-200" />

        {(!events || events.length === 0) ? (
          <p className="text-center text-gray-600">No upcoming events at this time.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
