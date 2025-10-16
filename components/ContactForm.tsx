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
      <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-green-700 text-center mb-10">
        ✅ Thanks, {submittedName || "friend"}! Your message has been sent.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-8 mb-10 max-w-3xl mx-auto"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Send Us a Message
      </h3>

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-md p-2 mb-4 text-center">
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
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your message..."
          rows={5}
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-6 w-full text-white font-medium py-3 rounded-md transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}