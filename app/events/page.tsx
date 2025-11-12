import { supabase } from "@/lib/supabaseClient";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: any) {
  const now = new Date();

  // --- Past events pagination ---
  const pastPage = searchParams?.pastPage ? parseInt(searchParams.pastPage, 10) : 1;
  const pastPageSize = 10;

  // --- Upcoming events pagination / "view all" ---
  const viewAllUpcoming = searchParams?.viewAllUpcoming === "true";
  const upcomingPageSize = 100;

  // --- Fetch upcoming events ---
  const upcomingQuery = supabase
    .from("events")
    .select("*")
    .gte("date", now.toISOString())
    .order("date", { ascending: true });

  if (!viewAllUpcoming) {
    upcomingQuery.limit(upcomingPageSize);
  }

  const { data: upcomingEvents, error: upcomingError } = await upcomingQuery;

  if (upcomingError) {
    console.error("Supabase error (upcoming events):", upcomingError.message);
    return (
      <section className="py-16 text-center text-gray-600">
        <p>Unable to load events right now. Please try again later.</p>
      </section>
    );
  }

  // --- Fetch past events ---
  const { data: pastEvents, count: totalPastCount, error: pastError } = await supabase
    .from("events")
    .select("*", { count: "exact" })
    .lt("date", now.toISOString())
    .order("date", { ascending: false })
    .range((pastPage - 1) * pastPageSize, pastPage * pastPageSize - 1);

  if (pastError) {
    console.error("Supabase error (past events):", pastError.message);
  }

  const totalPastPages = totalPastCount ? Math.ceil(totalPastCount / pastPageSize) : 1;
  const pageOptions = Array.from({ length: totalPastPages }, (_, i) => i + 1);

  return (
    <section className="py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          Upcoming Events
        </h1>

        {upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid gap-12 md:grid-cols-2 mb-4">
            {upcomingEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-8">
            No upcoming events at this time.
          </p>
        )}

        {!viewAllUpcoming && upcomingEvents && upcomingEvents.length >= upcomingPageSize && (
          <div className="text-center mb-8">
            <Link
              href={`/events?viewAllUpcoming=true`}
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              View All Upcoming Events
            </Link>
          </div>
        )}

        {pastEvents && pastEvents.length > 0 && (
          <details className="mt-12" open={searchParams?.pastPage !== undefined}>
            <summary className="cursor-pointer text-center text-lg font-bold py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
              Show Past Events
            </summary>

            <div className="grid gap-12 md:grid-cols-2 mt-6">
              {pastEvents.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-6 flex-wrap">
              {pastPage > 1 && (
                <Link
                  href={`/events?pastPage=${pastPage - 1}`}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Previous
                </Link>
              )}

              <span className="text-gray-700">
                Page {pastPage} of {totalPastPages}
              </span>

              <form method="get">
                <label htmlFor="jump-to-page" className="sr-only">
                  Jump to page
                </label>
                <select
                  id="jump-to-page"
                  name="pastPage"
                  defaultValue={pastPage}
                  className="border px-3 py-2 rounded-md"
                >
                  {pageOptions.map((pageNum) => (
                    <option key={pageNum} value={pageNum}>
                      Page {pageNum}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="ml-2 bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Go
                </button>
              </form>

              {pastPage < totalPastPages && (
                <Link
                  href={`/events?pastPage=${pastPage + 1}`}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </details>
        )}
      </div>
    </section>
  );
}