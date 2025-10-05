"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RSVPForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", event_id: "" });
  const [events, setEvents] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.event_id) {
      alert("Please fill out all required fields.");
      return;
    }
    console.log("RSVP submitted:", form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-green-700 text-center">
        ✅ Thanks, {form.name}! Your RSVP has been received.
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

      {/* Use consistent box sizing and vertical spacing */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-11 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Jane Doe"
            required
          />
        </div>

        {/* Email */}
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-11 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="jane@example.com"
            required
          />
        </div>

        {/* Phone */}
        <div className="sm:col-span-1">
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

        {/* Event */}
        <div className="sm:col-span-1">
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
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors"
      >
        Submit RSVP
      </button>
    </form>
  );
}
