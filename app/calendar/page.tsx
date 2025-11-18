import Calendar from "@/components/Calendar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Calendar | Littlestown Area Senior Center",
  description:
    "Stay updated with upcoming events and programs at Littlestown Area Senior Center.",
};

export default function CalendarPage() {
  return (
    <section className="py-16 bg-orange-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-stone-900 no-print">
          Community Calendar
        </h1>

        <p className="text-center text-stone-600 mb-6 no-print">
          View upcoming programs, events, and activities below.
        </p>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-orange-200">
          <Calendar />
        </div>
      </div>
    </section>
  );
}