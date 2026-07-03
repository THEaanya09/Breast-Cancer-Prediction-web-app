import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", icon: "🏠", label: "Home" },
  { path: "/awareness", icon: "📚", label: "Awareness" },
  { path: "/chatbot", icon: "💬", label: "Ask AI" },
  { path: "/contact", icon: "📞", label: "Help" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on questionnaire and result pages
  if (["/questionnaire", "/result", "/language"].includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4">
      <div className="bg-white/90 backdrop-blur border border-pink-100 rounded-2xl shadow-xl flex gap-1 px-2 py-2 w-full max-w-sm">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all duration-200
                ${active ? "bg-pink-100 text-pink-600" : "text-gray-400 hover:text-pink-400"}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs font-semibold mt-0.5 ${active ? "text-pink-600" : "text-gray-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
