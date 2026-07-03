import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const helplines = [
  { emoji: "🏥", name: "National Cancer Helpline", number: "1800-11-6789", tag: "Toll Free · 24/7" },
  { emoji: "💖", name: "Indian Cancer Society", number: "1800-22-1951", tag: "Mon–Sat, 9am–5pm" },
  { emoji: "🧠", name: "iCall Mental Health", number: "9152987821", tag: "Mon–Sat, 8am–10pm" },
  { emoji: "🌙", name: "Vandrevala Foundation", number: "1860-2662-345", tag: "24/7 Support" },
];

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 px-5 py-8">
      <div className="max-w-sm mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/")} className="text-pink-400 text-sm font-medium hover:text-pink-600">← Home</button>
          <span className="text-pink-600 font-extrabold text-lg">HerHealth AI 💖</span>
          <div className="w-12" />
        </div>

        <h2 className="text-2xl font-extrabold text-pink-700 mb-1">Help & Contact</h2>
        <p className="text-gray-400 text-sm mb-6">You're not alone. Reach out anytime. 💕</p>

        {/* Helplines */}
        <div className="mb-6">
          <p className="text-pink-600 font-bold text-sm mb-3">📞 Helpline Numbers</p>
          <div className="space-y-3">
            {helplines.map((h, i) => (
              <div key={i} className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{h.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">{h.name}</p>
                    <p className="text-gray-400 text-xs">{h.tag}</p>
                  </div>
                </div>
                <a
                  href={`tel:${h.number.replace(/-/g, "")}`}
                  className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 px-3 rounded-xl active:scale-95 transition-all"
                >
                  {h.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
          <p className="text-pink-600 font-bold text-sm mb-4">✉️ Send Us a Message</p>

          {submitted ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">💌</p>
              <p className="text-pink-600 font-bold text-lg">Message Sent!</p>
              <p className="text-gray-400 text-sm mt-2">Thank you for reaching out, {form.name}. We'll get back to you soon.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
                className="mt-4 text-pink-400 text-sm underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Your Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-pink-400 transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-pink-400 transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Your Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Type your question or concern here..."
                  rows={4}
                  className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-pink-400 transition resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.email || !form.message}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95"
              >
                Send Message 💕
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-300 text-xs mt-8">
          🔒 Your message is confidential and secure.
        </p>
      </div>
    </div>
  );
}
