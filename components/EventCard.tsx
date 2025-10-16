"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function EventCard({ event }: { event: any }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name || !form.email) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("rsvps").insert([
      {
        event_id: event.id,
        name: form.name,
        email: form.email,
        phone: form.phone || null,
      },
    ]);
    setLoading(false);

    if (error) {
      console.error("Supabase insert error:", error.message);
      setErrorMsg("Something went wrong. Please try again later.");
      return;
    }

    setSubmitted(true);
    setForm({ name: "", email: "", phone: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition hover:shadow-lg">
      {/* Event header */}
      {event.image_url && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {event.title}
      </h2>

      <p className="text-gray-600 mb-1 text-lg">
        {event.date
          ? new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })
          : "Date TBD"}
      </p>

      {event.location && (
        <p className="text-gray-500 mb-4">📍 {event.location}</p>
      )}

      <p className="text-gray-700 mb-6 leading-relaxed text-lg">
        {event.description || "Join us for this community event!"}
      </p>

      {/* RSVP section */}
      {!open && !submitted && (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-md text-lg transition-colors"
        >
          Sign Up for This Event
        </button>
      )}

      {open && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          {errorMsg && (
            <p className="text-red-600 text-sm text-center mb-2">
              {errorMsg}
            </p>
          )}

          <div className="grid gap-3">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name *"
              className="border border-gray-300 rounded-md px-3 py-2 text-lg focus:ring-2 focus:ring-blue-100"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email *"
              className="border border-gray-300 rounded-md px-3 py-2 text-lg focus:ring-2 focus:ring-blue-100"
              required
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
              className="border border-gray-300 rounded-md px-3 py-2 text-lg focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 text-white font-medium py-2.5 rounded-md text-lg transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 border border-gray-300 text-gray-600 font-medium py-2.5 rounded-md text-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-300 text-green-700 text-center rounded-lg p-4 mt-4 text-lg font-medium">
          ✅ Thanks for RSVPing! We look forward to seeing you.
        </div>
      )}
    </div>
  );
}
