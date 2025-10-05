"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  date: string | null;
};

type RSVPFormData = {
  name: string;
  email: string;
  phone: string;
  event_id: string;
};

export default function RSVPForm() {
  const [form, setForm] = useState<RSVPFormData>({
    name: "",
    email: "",
    phone: "",
    event_id: "",
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [submitted, setSubmitted] = useState<RSVPFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, date")
        .order("date", { ascending: true });
      if (!error && data) setEvents(data);
    }
    fetchEvents();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name || !form.email || !form.event_id) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("rsvps").insert([
      {
        event_id: form.event_id,
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

    // Capture the submitted data safely and reset
    setSubmitted({ ...form });
    setForm({ name: "", email: "", phone: "", event_id: "" });
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-green-700 text-center">
        ✅ Thanks, {submitted.name}! Your RSVP has been received.
      </div>
    );
  }

  return (
    <form
      id="rsvp-form"
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-8 mb-8 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        RSVP for an Event
      </h2>

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-md p-2 mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-11 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-11 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-11 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="717-555-0101"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event *
          </label>
          <select
            name="event_id"
            value={form.event_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-11 bg-white focus:outline-none focus:ring focus:ring-blue-100"
            required
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}{" "}
                {event.date
                  ? `(${new Date(event.date).toLocaleDateString()})`
                  : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-8 w-full text-white font-medium py-3 rounded-md transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit RSVP"}
      </button>
    </form>
  );
}
