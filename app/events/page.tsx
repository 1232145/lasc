import { supabase } from "@/lib/supabaseClient";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: any) {
  // Await searchParams before using its properties
  const params = await searchParams;
  const now = new Date();

  // --- Past events pagination ---
  const pastPage = params?.pastPage ? parseInt(params.pastPage, 10) : 1;
  const pastPageSize = 10;

  // --- Upcoming events pagination / "view all" ---
  const viewAllUpcoming = params?.viewAllUpcoming === "true";
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
    <section className="py-20 bg-[var(--bg-primary)] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)] font-serif">
            Upcoming Events
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Join us for engaging activities, educational programs, and community gatherings designed for older adults.
          </p>
        </div>

        {upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 mb-8">
            {upcomingEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-[var(--text-muted)] mb-4">
              No upcoming events at this time.
            </p>
            <p className="text-base text-[var(--text-muted)]">
              Check back soon for new community activities and programs!
            </p>
          </div>
        )}

        {!viewAllUpcoming && upcomingEvents && upcomingEvents.length >= upcomingPageSize && (
          <div className="text-center mb-12">
            <Link
              href={`/events?viewAllUpcoming=true`}
              className="btn-primary inline-block px-8 py-4 text-lg font-semibold shadow-[var(--shadow-lg)]"
            >
              View All Upcoming Events
            </Link>
          </div>
        )}

        {pastEvents && pastEvents.length > 0 && (
          <details className="mt-16 card bg-[var(--bg-secondary)] rounded-2xl p-6" open={params?.pastPage !== undefined}>
            <summary className="cursor-pointer text-center text-xl font-bold py-4 text-[var(--text-accent)] hover:text-[var(--primary-800)] transition-colors font-serif">
              Browse Past Events
            </summary>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              {pastEvents.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
              {pastPage > 1 && (
                <Link
                  href={`/events?pastPage=${pastPage - 1}`}
                  className="btn-secondary px-6 py-3 text-base font-medium"
                >
                  Previous
                </Link>
              )}

              <span className="text-[var(--text-secondary)] font-medium px-4 py-2">
                Page {pastPage} of {totalPastPages}
              </span>

              <form method="get" className="flex items-center gap-3">
                <label htmlFor="jump-to-page" className="sr-only">
                  Jump to page
                </label>
                <select
                  id="jump-to-page"
                  name="pastPage"
                  defaultValue={pastPage}
                  className="border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)] px-4 py-2 rounded-lg focus:ring-2 focus:ring-[var(--border-focus)] focus:border-[var(--border-focus)] transition-colors shadow-[var(--shadow-xs)]"
                >
                  {pageOptions.map((pageNum) => (
                    <option key={pageNum} value={pageNum}>
                      Page {pageNum}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 text-base font-medium"
                >
                  Go
                </button>
              </form>

              {pastPage < totalPastPages && (
                <Link
                  href={`/events?pastPage=${pastPage + 1}`}
                  className="btn-secondary px-6 py-3 text-base font-medium"
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