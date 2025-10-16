import { supabase } from "@/lib/supabaseClient";
import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic";

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

  if (!events || events.length === 0) {
    return (
      <section className="py-16 text-center text-gray-600">
        <p>No upcoming events at this time.</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          Upcoming Events
        </h1>

        <div className="grid gap-12 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
