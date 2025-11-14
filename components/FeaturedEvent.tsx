import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function FeaturedEvent() {
  const todayDateString = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", todayDateString)
    .order("date", { ascending: true })
    .limit(1);

  if (error || !data || data.length === 0) {
    return (
      <section className="py-16 text-center text-gray-600">
        <p>No upcoming events at this time.</p>
      </section>
    );
  }

  const event = data[0];

  return (
    <section className="py-16 bg-[var(--background)]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Next Event
        </h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            {event.date
              ? new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
              : "Date TBD"}
          </p>
          <p className="text-gray-700 dark:text-gray-200">{event.description}</p>
        </div>
      </div>
    </section>
  );
}
