import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-pink-200 rounded-full opacity-30 blur-3xl -translate-x-16 -translate-y-16 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-200 rounded-full opacity-30 blur-3xl translate-x-16 translate-y-16 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">

        {/* Logo / Icon */}
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 border-4 border-pink-200">
          <span className="text-5xl">🩺</span>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-extrabold text-pink-700 mb-2 tracking-tight leading-tight">
          HerHealth AI
          <span className="ml-2">💖</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg font-semibold text-rose-500 mb-4">
          Early detection saves lives 💖
        </p>

        {/* Divider */}
        <div className="w-16 h-1 bg-pink-300 rounded-full mb-6" />

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-10 px-2">
          A private, AI-powered assistant for early breast health awareness.
          Answer a few gentle questions and get personalised insights — safe,
          free, and always confidential.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/language")}
          className="w-full bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-md transition-all duration-200"
        >
          Start Assessment ✨
        </button>

        {/* Secondary links */}
        <div className="flex gap-6 mt-8">
          <button
            onClick={() => navigate("/awareness")}
            className="text-pink-500 text-sm font-medium underline underline-offset-2 hover:text-pink-700"
          >
            📚 Awareness
          </button>
          <button
            onClick={() => navigate("/chatbot")}
            className="text-pink-500 text-sm font-medium underline underline-offset-2 hover:text-pink-700"
          >
            💬 Ask AI
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="text-pink-500 text-sm font-medium underline underline-offset-2 hover:text-pink-700"
          >
            📞 Help
          </button>
        </div>

        {/* Footer note */}
        <p className="text-gray-400 text-xs mt-10">
          🔒 Your answers are never stored or shared.
        </p>
      </div>
    </div>
  );
}
