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
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Next Event
        </h2>
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-1">
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">{event.description}</p>
        </div>
      </div>
    </section>
  );
}
