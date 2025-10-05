import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Calendar | Littlestown Area Senior Center",
  description:
    "Stay updated with upcoming events and programs at Littlestown Area Senior Center.",
};

export default function CalendarPage() {
  return (
    <section className="py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          Community Calendar
        </h1>

        <p className="text-center text-gray-600 mb-6">
          View upcoming programs, events, and activities below. You can also
          add this calendar to your own Google account to stay notified.
        </p>

        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-xl shadow-md border border-gray-200">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_PUBLIC_URL&ctz=America/New_York"
            style={{ border: 0 }}
            className="absolute top-0 left-0 w-full h-full"
            title="Littlestown Area Senior Center Google Calendar"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
