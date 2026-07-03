import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    icon: "🔍",
    title: "Common Symptoms",
    subtitle: "Know the early signs",
    color: "from-pink-100 to-rose-100",
    border: "border-pink-200",
    content: {
      heading: "Symptoms to Watch For",
      points: [
        "A new lump or mass in the breast or armpit",
        "Swelling of all or part of the breast",
        "Skin dimpling or irritation",
        "Breast or nipple pain",
        "Nipple retraction (turning inward)",
        "Nipple or breast skin that is red, dry, flaking, or thickened",
        "Nipple discharge (other than breast milk)",
        "Any change in the size or shape of the breast",
      ],
      note: "Note: These symptoms can also be caused by non-cancerous conditions. Always see a doctor for a proper diagnosis.",
    },
  },
  {
    icon: "🛡️",
    title: "Prevention Tips",
    subtitle: "Lifestyle choices that help",
    color: "from-rose-100 to-pink-100",
    border: "border-rose-200",
    content: {
      heading: "How to Reduce Your Risk",
      points: [
        "Maintain a healthy weight, especially after menopause",
        "Be physically active — aim for 150 min/week of moderate exercise",
        "Limit alcohol consumption",
        "Don't smoke — smoking increases breast cancer risk",
        "Breastfeed if possible — it may slightly lower risk",
        "Limit postmenopausal hormone therapy",
        "Eat a balanced diet rich in fruits and vegetables",
        "Manage stress through yoga, meditation, or therapy",
      ],
      note: "Prevention is powerful. Small daily habits make a big difference over time.",
    },
  },
  {
    icon: "🩺",
    title: "When to See a Doctor",
    subtitle: "Don't delay, act today",
    color: "from-pink-100 to-fuchsia-100",
    border: "border-pink-200",
    content: {
      heading: "Consult a Doctor If You Notice",
      points: [
        "A lump that is new, hard, or painless",
        "Changes in breast size, shape, or skin texture",
        "Nipple discharge, especially if bloody",
        "Persistent pain in one breast that doesn't go away",
        "Skin that looks like an orange peel (peau d'orange)",
        "Swelling in the armpit or around the collarbone",
        "You are 40+ and haven't had a mammogram in 1–2 years",
        "You have a strong family history of breast cancer",
      ],
      note: "Early detection is the best protection. A quick consultation can save your life.",
    },
  },
  {
    icon: "✋",
    title: "Self-Examination Guide",
    subtitle: "Check yourself monthly",
    color: "from-fuchsia-50 to-pink-100",
    border: "border-fuchsia-200",
    content: {
      heading: "How to Do a Breast Self-Exam",
      points: [
        "Step 1: Stand before a mirror with shoulders straight — look for visual changes",
        "Step 2: Raise your arms and look for the same changes",
        "Step 3: While at the mirror, look for any signs of fluid from the nipple",
        "Step 4: Lie down and use your right hand to feel your left breast and vice versa",
        "Step 5: Use a firm, smooth touch in small circular motions",
        "Step 6: Cover the entire breast from armpit to armpit, and from top to abdomen",
        "Step 7: Feel your breasts while you are standing or sitting",
        "Best time: 3–5 days after your period starts when breasts are least tender",
      ],
      note: "Do this every month and note any changes. Report any new findings to your doctor.",
    },
  },
  {
    icon: "💊",
    title: "Screening & Tests",
    subtitle: "What to expect",
    color: "from-rose-50 to-pink-100",
    border: "border-rose-200",
    content: {
      heading: "Recommended Screening Tests",
      points: [
        "Mammogram: X-ray of the breast — recommended annually after age 40",
        "Breast Ultrasound: Used alongside mammograms for dense breast tissue",
        "MRI: For high-risk women or those with dense breast tissue",
        "Clinical Breast Exam: Done by a healthcare professional every 1–3 years",
        "BRCA Gene Test: For women with strong family history",
        "Biopsy: If a lump or abnormality is found, tissue is tested",
        "Thermography: Detects heat patterns — used as a supplemental tool",
      ],
      note: "Talk to your doctor about which screenings are right for your age and risk level.",
    },
  },
  {
    icon: "💬",
    title: "Myths & Facts",
    subtitle: "Truth about breast cancer",
    color: "from-pink-50 to-rose-50",
    border: "border-pink-100",
    content: {
      heading: "Common Myths Debunked",
      points: [
        "MYTH: Only women get breast cancer. FACT: Men can get it too (rare but real).",
        "MYTH: A lump always means cancer. FACT: Most lumps are benign.",
        "MYTH: Breast cancer always runs in families. FACT: 70–80% have no family history.",
        "MYTH: Underwire bras cause breast cancer. FACT: No scientific evidence for this.",
        "MYTH: Small-breasted women are safer. FACT: Breast size doesn't affect risk.",
        "MYTH: Mammograms cause cancer. FACT: The radiation dose is extremely small.",
        "MYTH: If no symptoms, I'm fine. FACT: Early-stage cancer often has no symptoms.",
      ],
      note: "Stay informed, stay empowered. Reliable information saves lives.",
    },
  },
];

function Modal({ card, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{card.icon}</span>
            <h3 className="text-pink-700 font-extrabold text-lg">{card.content.heading}</h3>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-2xl font-light leading-none">×</button>
        </div>

        <ul className="space-y-3 mb-4">
          {card.content.points.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600 text-sm leading-snug">
              <span className="text-pink-400 mt-0.5 shrink-0">💖</span>
              {p}
            </li>
          ))}
        </ul>

        <div className="bg-pink-50 rounded-xl p-3">
          <p className="text-pink-500 text-xs italic">{card.content.note}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-2xl transition-all duration-200 active:scale-95"
        >
          Got it! 💕
        </button>
      </div>
    </div>
  );
}

export default function Awareness() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 px-5 py-8">
      <div className="max-w-sm mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate("/")} className="text-pink-400 text-sm font-medium hover:text-pink-600">← Home</button>
          <span className="text-pink-600 font-extrabold text-lg">HerHealth AI 💖</span>
          <div className="w-12" />
        </div>

        <h2 className="text-2xl font-extrabold text-pink-700 mt-6 mb-1">Awareness Hub</h2>
        <p className="text-gray-400 text-sm mb-6">Tap any card to learn more 💕</p>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => setActiveModal(card)}
              className={`bg-gradient-to-br ${card.color} border-2 ${card.border} rounded-2xl p-4 text-left shadow-sm hover:shadow-md active:scale-95 transition-all duration-200`}
            >
              <span className="text-3xl mb-2 block">{card.icon}</span>
              <p className="font-bold text-gray-700 text-sm leading-snug">{card.title}</p>
              <p className="text-gray-400 text-xs mt-1">{card.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Bottom Nav */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => navigate("/chatbot")}
            className="flex-1 bg-white border-2 border-pink-200 text-pink-500 font-bold py-3 rounded-2xl text-sm hover:bg-pink-50 active:scale-95 transition-all"
          >
            💬 Ask AI
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="flex-1 bg-pink-500 text-white font-bold py-3 rounded-2xl text-sm hover:bg-pink-600 active:scale-95 transition-all"
          >
            📞 Get Help
          </button>
        </div>
      </div>

      {/* Modal */}
      {activeModal && <Modal card={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}
