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
      <section className="py-16 text-center text-stone-600 dark:text-stone-400">
        <p>No upcoming events at this time.</p>
      </section>
    );
  }

  const event = data[0];

  return (
    <section className="py-16 bg-white dark:bg-stone-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-stone-900 dark:text-stone-100">
          Next Event
        </h2>
        <div className="card bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-stone-900 dark:text-stone-100">{event.title}</h3>
          <p className="text-orange-600 dark:text-orange-400 mb-2 font-medium text-lg">
            {event.date
              ? new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
              : "Date TBD"}
          </p>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{event.description}</p>
        </div>
      </div>
    </section>
  );
}
