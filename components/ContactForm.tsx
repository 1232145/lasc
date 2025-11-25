"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name || !form.email || !form.message) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/submit-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to send");
      }

      setSubmittedName(form.name);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again later.");
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-green-800 text-center mb-10 font-medium">
        ✅ Thanks, {submittedName || "friend"}! Your message has been sent.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-white shadow-lg rounded-xl p-8 mb-10 max-w-3xl mx-auto border border-orange-200"
    >
      <h3 className="text-xl font-semibold text-stone-900 mb-4 text-center">
        Send Us a Message
      </h3>

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-800 text-sm rounded-md p-3 mb-4 text-center font-medium">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-5">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="appearance-none block w-full px-4 py-3 border border-orange-300 rounded-lg text-stone-900 placeholder-stone-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          className="appearance-none block w-full px-4 py-3 border border-orange-300 rounded-lg text-stone-900 placeholder-stone-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your message..."
          rows={5}
          required
          className="appearance-none block w-full px-4 py-3 border border-orange-300 rounded-lg text-stone-900 placeholder-stone-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors resize-vertical"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-primary mt-6 w-full text-white font-medium py-3 rounded-xl transition-all duration-300 ${
          loading
            ? "bg-stone-400 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        }`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}