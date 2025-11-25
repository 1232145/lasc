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

  // >>> TIMEZONE-SAFE DATE CHECK (minimal addition)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = event.date ? new Date(event.date + "T00:00:00") : null;
  const isPastEvent = eventDate ? eventDate < today : false;
  // <<< END INSERT

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // >>> UPDATED VALIDATION (minimal change)
    if (!form.name) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }
    if (!form.email && !form.phone) {
      setErrorMsg("Please provide at least an email or a phone number.");
      return;
    }
    // <<< END UPDATE

    setLoading(true);

    // Check if RSVP already exists for this email and event
    let existingRSVP = null;
    let checkError = null;

    // >>> ONLY check duplicates if email was provided
    if (form.email) {
      const result = await supabase
        .from("rsvps")
        .select("id")
        .eq("event_id", event.id)
        .eq("email", form.email.toLowerCase().trim())
        .maybeSingle();
      existingRSVP = result.data;
      checkError = result.error;
    }
    // <<< END UPDATE

    if (checkError) {
      console.error("Error checking for duplicate RSVP:", checkError);
      setErrorMsg("Something went wrong. Please try again later.");
      setLoading(false);
      return;
    }

    if (existingRSVP) {
      setErrorMsg("There is already an email subscribed to this event.");
      setLoading(false);
      return;
    }

    // Insert new RSVP
    const { error } = await supabase.from("rsvps").insert([
      {
        event_id: event.id,
        name: form.name,
        email: form.email ? form.email.toLowerCase().trim() : null,
        phone: form.phone || null,
      },
    ]);
    setLoading(false);

    if (error) {
      console.error("Supabase insert error:", error.message);
      // Check if it's a duplicate constraint error
      if (error.message.includes("duplicate") || error.code === "23505") {
        setErrorMsg("There is already an email subscribed to this event.");
      } else {
        setErrorMsg("Something went wrong. Please try again later.");
      }
      return;
    }

    setSubmitted(true);
    setForm({ name: "", email: "", phone: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="card bg-[var(--bg-elevated)] rounded-xl shadow-[var(--shadow-md)] p-8 border border-[var(--border-primary)] transition-all duration-300 hover:shadow-[var(--shadow-warm)] hover:transform hover:-translate-y-2">
      {/* Event header */}
      {event.image_url && (
        <div className="relative w-full h-52 mb-6 rounded-xl overflow-hidden border border-[var(--border-secondary)]">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 font-serif">{event.title}</h2>

      <p className="text-[var(--text-secondary)] mb-2 text-lg font-medium">
        {event.date
          ? new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })
          : "Date TBD"}
      </p>

      {/* show start/end time if they exist */}
      {event.start_time && (
        <p className="text-[var(--text-accent)] mb-2 text-base font-medium">
          🕒 {formatTime(event.start_time)}
          {event.end_time ? ` – ${formatTime(event.end_time)}` : ""}
        </p>
      )}

      {event.location && (
        <p className="text-[var(--text-accent)] mb-5 font-medium">📍 {event.location}</p>
      )}

      <p className="text-[var(--text-tertiary)] mb-8 leading-relaxed text-base">
        {event.description || "Join us for this community event!"}
      </p>

      {/* RSVP section */}
      {!isPastEvent && !open && !submitted && (
        <button
          onClick={() => setOpen(true)}
          className="btn-primary w-full text-white font-semibold py-3 rounded-xl text-lg shadow-[var(--shadow-lg)]"
        >
          Sign Up for This Event
        </button>
      )}

      {!isPastEvent && open && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-secondary)] shadow-[var(--shadow-xs)]"
        >
          {errorMsg && (
            <p className="text-[var(--text-error)] text-sm text-center mb-4 font-medium bg-[var(--coral-50)] border border-[var(--border-error)] rounded-lg py-2 px-3">{errorMsg}</p>
          )}

          <div className="grid gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name *"
              className="border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-[var(--border-focus)] focus:border-[var(--border-focus)] transition-colors shadow-[var(--shadow-xs)]"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-[var(--border-focus)] focus:border-[var(--border-focus)] transition-colors shadow-[var(--shadow-xs)]"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-[var(--border-focus)] focus:border-[var(--border-focus)] transition-colors shadow-[var(--shadow-xs)]"
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Please provide at least an email or phone number.
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary flex-1 text-white font-medium py-3 rounded-xl text-base transition-all duration-300 ${loading
                  ? "bg-[var(--neutral-400)] cursor-not-allowed opacity-60"
                  : "shadow-[var(--shadow-md)]"
                }`}
            >
              {loading ? "Submitting..." : "Submit RSVP"}
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary flex-1 font-medium py-3 rounded-xl text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="bg-[var(--success-50)] border border-[var(--border-success)] text-[var(--text-success)] text-center rounded-xl p-5 mt-6 text-base font-medium shadow-[var(--shadow-xs)]">
          ✅ Thanks for RSVPing! We look forward to seeing you.
        </div>
      )}
    </div>
  );
}