import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    q: "Is breast pain dangerous?",
    a: "Most breast pain (mastalgia) is not a sign of cancer and is very common. It can be related to hormonal changes, your menstrual cycle, or benign cysts. However, if the pain is persistent, localised, or accompanied by a lump or discharge, please see a doctor for peace of mind.",
  },
  {
    q: "When should I see a doctor?",
    a: "You should consult a doctor if you notice a new lump or hardening, unexplained changes in breast shape or size, nipple discharge (especially bloody), skin dimpling, or persistent pain that doesn't go away. It's also wise to see a doctor if you have a strong family history of breast cancer.",
  },
  {
    q: "How often should I self-examine?",
    a: "You should perform a breast self-examination once a month. The best time is 3–5 days after your period begins when breasts are least swollen and tender. If you no longer have periods, pick a consistent day each month, like the 1st.",
  },
  {
    q: "At what age should I start mammograms?",
    a: "Most guidelines recommend starting annual mammograms at age 40 for average-risk women. If you have a family history of breast cancer or other risk factors, your doctor may recommend starting earlier — sometimes as young as 30.",
  },
  {
    q: "Can breast cancer be prevented?",
    a: "While there is no guaranteed prevention, you can significantly reduce your risk by maintaining a healthy weight, exercising regularly, limiting alcohol, not smoking, and attending regular screenings. Early detection is the most powerful tool we have.",
  },
  {
    q: "Is this app a medical diagnosis?",
    a: "No. HerHealth AI is an awareness and education tool only. It does not provide medical diagnoses. The risk assessment is based on general indicators and should not replace professional medical advice. Always consult a qualified healthcare provider.",
  },
  {
    q: "What are free helpline numbers in India?",
    a: "You can reach iCall at 9152987821, Vandrevala Foundation at 1860-2662-345 (24/7), and the National Cancer Helpline at 1800-11-6789 (toll-free). For breast cancer support, the Indian Cancer Society also has resources at 1800-22-1951.",
  },
];

const WELCOME = {
  role: "bot",
  text: "Hi there! 💖 I'm your HerHealth AI assistant. I'm here to answer your questions about breast health, symptoms, and when to seek help. Tap a question below or type your own!",
};

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text: text.trim() };

    // Find matching FAQ
    const lower = text.toLowerCase();
    const matched = faqs.find((f) =>
  f.q.toLowerCase().includes(lower) ||
  lower.includes(f.q.toLowerCase().split(" ").slice(0, 3).join(" ")) ||
  (lower.includes("pain") && f.q.includes("pain")) ||
  (lower.includes("doctor") && f.q.includes("doctor")) ||
  (lower.includes("mammogram") && f.q.includes("mammogram")) ||
  (lower.includes("prevent") && f.q.includes("prevent")) ||
  (lower.includes("self") && f.q.includes("self")) ||
  (lower.includes("helpline") && f.q.includes("helpline")) ||
  (lower.includes("diagnosis") && f.q.includes("diagnosis"))
);

    const botText = matched
      ? matched.a
      : "That's a great question! I'd recommend speaking with a qualified healthcare professional for personalised advice. You can also check the Awareness section of HerHealth AI for more information. 💕";

    setMessages((prev) => [...prev, userMsg, { role: "bot", text: botText }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-pink-100 px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-pink-400 hover:text-pink-600 mr-1">←</button>
        <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center text-lg">🤖</div>
        <div>
          <p className="font-extrabold text-pink-700 text-sm">HerHealth AI Assistant</p>
          <p className="text-green-400 text-xs font-medium">● Online · Ready to help</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "bot" && (
              <div className="w-7 h-7 bg-pink-200 rounded-full flex items-center justify-center text-sm mr-2 mt-1 shrink-0">💖</div>
            )}
            <div
              className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${m.role === "user"
                  ? "bg-pink-500 text-white rounded-br-sm"
                  : "bg-white text-gray-600 rounded-bl-sm border border-pink-100"
                }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* FAQ Quick Buttons */}
      <div className="px-4 pb-2">
        <p className="text-xs text-gray-400 mb-2 ml-1">Quick questions:</p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {faqs.slice(0, 4).map((f, i) => (
            <button
              key={i}
              onClick={() => sendMessage(f.q)}
              className="shrink-0 bg-white border border-pink-200 text-pink-500 text-xs font-medium px-3 py-2 rounded-xl hover:bg-pink-50 active:scale-95 transition-all whitespace-nowrap shadow-sm"
            >
              {f.q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur border-t border-pink-100 px-4 py-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Type a question..."
          className="flex-1 bg-pink-50 border border-pink-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-pink-400 transition"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 text-white rounded-xl px-4 font-bold text-sm transition-all active:scale-95"
        >
          Send
        </button>
      </div>
    </div>
  );
}
