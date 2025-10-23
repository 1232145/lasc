import Calendar from "@/components/Calendar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Calendar | Littlestown Area Senior Center",
  description:
    "Stay updated with upcoming events and programs at Littlestown Area Senior Center.",
};

export default function CalendarPage() {
  return (
    <section className="py-16 bg-[var(--background)] min-h-screen printable-calendar-section">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100 no-print">
          Community Calendar
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 no-print">
          View upcoming programs, events, and activities below.
        </p>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-md printable-calendar-container">
          <Calendar />
        </div>
      </div>
    </section>
  );
}