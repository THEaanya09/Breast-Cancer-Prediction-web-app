import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";

// ─────────────────────────────────────────────
//  EXPORTED: used by Result.js
// ─────────────────────────────────────────────
export const findNearbyDoctor = () => {
  if (!navigator.geolocation) {
    window.open(
      "https://www.google.com/maps/search/gynecologist+hospital/",
      "_blank"
    );
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      window.open(
        `https://www.google.com/maps/search/gynecologist+hospital/@${latitude},${longitude},15z`,
        "_blank"
      );
    },
    () => {
      // fallback if permission denied
      window.open(
        "https://www.google.com/maps/search/gynecologist+hospital/",
        "_blank"
      );
    }
  );
};

// ─────────────────────────────────────────────
//  FEATURE CARDS CONFIG
// ─────────────────────────────────────────────
const CARDS = (t, navigate) => [
  {
    key: "assessment",
    label: t.takeAssessment || "🧠 Take Assessment",
    desc: t.mentalHealth || "Mental health & risk check",
    gradient: "from-pink-400 to-rose-500",
    shadow: "shadow-pink-200",
    emoji: "🧠",
    action: () => navigate("/questionnaire"),
  },
  {
    key: "selftest",
    label: t.selfTest || "🩺 Visual Self-Test",
    desc: t.selfCheck || "Guided self-examination",
    gradient: "from-rose-400 to-pink-500",
    shadow: "shadow-rose-200",
    emoji: "🩺",
    action: () => navigate("/self-assessment"),
  },
  {
    key: "doctor",
    label: t.findDoctor || "🏥 Find Nearby Doctor",
    desc: t.locateDoctor || "Locate gynecologists near you",
    gradient: "from-fuchsia-400 to-pink-500",
    shadow: "shadow-fuchsia-200",
    emoji: "🏥",
    action: findNearbyDoctor,
  },
  {
    key: "exercise",
    label: t.exercise || "🧘 Yoga & Breathing",
    desc: t.breathingDesc || "15-min breathing + 30-min yoga",
    gradient: "from-pink-300 to-fuchsia-400",
    shadow: "shadow-pink-200",
    emoji: "🧘",
    action: () => navigate("/exercise"),
  },
  {
    key: "diet",
    label: t.diet || "🥗 Diet & Nutrition",
    desc: t.mealPlan || "Personalised meal plan for you",
    gradient: "from-rose-300 to-pink-400",
    shadow: "shadow-rose-200",
    emoji: "🥗",
    action: () => navigate("/diet"),
  },
];

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang");
  const t = translations[lang] || translations["en"];

  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [inputName, setInputName] = useState("");
  const [nameSet, setNameSet] = useState(() => !!localStorage.getItem("username"));
  const [visible, setVisible] = useState(false);

  // Guard: if no language selected, redirect to /language first
  useEffect(() => {
    if (!localStorage.getItem("lang")) {
      navigate("/language", { replace: true });
    }
  }, [navigate]);

  // Fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const handleNameSubmit = () => {
    const name = inputName.trim();
    if (!name) return;
    localStorage.setItem("username", name);
    setUsername(name);
    setNameSet(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleNameSubmit();
  };

  const cards = CARDS(t, navigate);

  // ── NAME CAPTURE SCREEN
  if (!nameSet) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#fff0f5 0%,#ffe4ec 45%,#ffd6e7 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1.5rem",
          fontFamily: "'Nunito', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient blobs */}
        <div style={{
          position: "absolute", top: "-80px", left: "-80px",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,182,207,0.5) 0%,transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", right: "-60px",
          width: "240px", height: "240px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(249,100,130,0.35) 0%,transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "360px", width: "100%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          textAlign: "center",
        }}>
          {/* Heart icon */}
          <div style={{
            width: "88px", height: "88px", borderRadius: "50%",
            background: "white",
            boxShadow: "0 8px 32px rgba(201,24,74,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2.6rem",
            border: "3px solid rgba(249,100,130,0.2)",
          }}>
            💖
          </div>

          <h1 style={{
            fontSize: "clamp(1.7rem, 6vw, 2.2rem)",
            fontWeight: 900,
            color: "#c9184a",
            margin: "0 0 0.5rem",
            lineHeight: 1.2,
          }}>
            {t.dashboardTitle || "Let's Care Together 💖"}
          </h1>

          <p style={{
            color: "#e05578", fontSize: "0.95rem",
            fontWeight: 600, margin: "0 0 2.2rem",
          }}>
            {t.enterName || "What's your name?"}
          </p>

          {/* Name input */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 4px 24px rgba(201,24,74,0.10)",
            padding: "1.5rem",
            border: "1.5px solid rgba(249,100,130,0.18)",
          }}>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.namePlaceholder || "Enter your name..."}
              autoFocus
              style={{
                width: "100%",
                border: "2px solid #ffc2d4",
                borderRadius: "14px",
                padding: "0.85rem 1.1rem",
                fontSize: "1rem",
                fontFamily: "inherit",
                color: "#c9184a",
                fontWeight: 700,
                outline: "none",
                background: "#fff5f8",
                boxSizing: "border-box",
                marginBottom: "1rem",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#f94f73")}
              onBlur={(e) => (e.target.style.borderColor = "#ffc2d4")}
            />

            <button
              onClick={handleNameSubmit}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: "linear-gradient(135deg,#f94f73 0%,#c9184a 100%)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                fontSize: "1rem",
                fontWeight: 800,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(201,24,74,0.32)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(201,24,74,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,24,74,0.32)";
              }}
            >
              {t.letsBegin || "Let's Begin 💖"}
            </button>
          </div>

          <p style={{
            marginTop: "1.2rem", fontSize: "0.72rem",
            color: "rgba(200,50,90,0.45)",
          }}>
            🔒 Your name is saved only on this device
          </p>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
      </div>
    );
  }

  // ── DASHBOARD SCREEN
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff0f5 0%,#ffe4ec 45%,#ffd6e7 100%)",
        fontFamily: "'Nunito', system-ui, sans-serif",
        padding: "0 0 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div style={{
        position: "fixed", top: "-60px", left: "-60px",
        width: "260px", height: "260px", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(255,182,207,0.45) 0%,transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-40px", right: "-40px",
        width: "220px", height: "220px", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(249,100,130,0.3) 0%,transparent 70%)",
        filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{
        maxWidth: "420px", margin: "0 auto",
        padding: "0 1.25rem",
        position: "relative", zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>

        {/* ── HEADER */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "3rem", paddingBottom: "0.5rem",
        }}>
          <div>
            <p style={{
              fontSize: "0.78rem", color: "#e05578",
              fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.08em", margin: 0,
            }}>
              {t.welcomeMessage || "Welcome back"} 👋
            </p>
            <h1 style={{
              fontSize: "clamp(1.4rem,5vw,1.8rem)",
              fontWeight: 900, color: "#c9184a",
              margin: "0.1rem 0 0", lineHeight: 1.2,
            }}>
              {username} 💖
            </h1>
          </div>

          {/* Avatar */}
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "linear-gradient(135deg,#f94f73,#c9184a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem",
            boxShadow: "0 4px 16px rgba(201,24,74,0.28)",
            cursor: "pointer",
            flexShrink: 0,
          }}
            title="Tap to change name"
            onClick={() => {
              localStorage.removeItem("username");
              setNameSet(false);
              setUsername("");
              setInputName("");
            }}
          >
            👩
          </div>
        </div>

        {/* ── TITLE PILL */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          padding: "0.35rem 1rem",
          background: "rgba(255,182,207,0.4)",
          borderRadius: "999px",
          fontSize: "0.75rem", fontWeight: 700,
          color: "#c9184a", letterSpacing: "0.05em",
          border: "1px solid rgba(249,100,130,0.22)",
          backdropFilter: "blur(6px)",
          marginTop: "0.75rem", marginBottom: "1.5rem",
        }}>
          ✨ {t.aiPowered || "AI-Powered Women's Health Assistant"}
        </div>

        {/* ── GREETING CARD */}
        <div style={{
          background: "linear-gradient(135deg,#f94f73 0%,#c9184a 100%)",
          borderRadius: "24px",
          padding: "1.4rem 1.5rem",
          marginBottom: "1.75rem",
          boxShadow: "0 8px 32px rgba(201,24,74,0.28)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-20px", right: "-20px",
            width: "100px", height: "100px", borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }} />
          <div style={{
            position: "absolute", bottom: "-30px", right: "60px",
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }} />
          <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.85, fontWeight: 600 }}>
            {t.healthPriority || "Your health, your priority 🌸"}
          </p>
          <p style={{
            margin: "0.3rem 0 0",
            fontSize: "clamp(0.95rem,3.5vw,1.05rem)",
            fontWeight: 700, lineHeight: 1.4,
          }}>
            {t.dashboardTitle || "Let's Care Together 💖"}
          </p>
        </div>

        {/* ── SECTION LABEL */}
        <p style={{
          fontSize: "0.72rem", fontWeight: 800,
          color: "#c9184a", textTransform: "uppercase",
          letterSpacing: "0.1em", margin: "0 0 0.85rem 0.2rem",
        }}>
          {t.whatToDo || "What would you like to do?"}
        </p>

        {/* ── FEATURE CARDS */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "0.85rem",
        }}>
          {cards.map((card, i) => (
            <FeatureCard key={card.key} card={card} delay={i * 80} visible={visible} />
          ))}
        </div>

        {/* ── FOOTER */}
        <p style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "0.68rem",
          color: "rgba(200,50,90,0.4)",
        }}>
          {t.awarenessOnly || "⚠️ For awareness only · Not a medical diagnosis"}
        </p>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
//  FEATURE CARD SUB-COMPONENT
// ─────────────────────────────────────────────
function FeatureCard({ card, delay, visible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={card.action}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      style={{
        width: "100%",
        background: "white",
        border: "1.5px solid rgba(249,100,130,0.15)",
        borderRadius: "20px",
        padding: "1.1rem 1.25rem",
        display: "flex", alignItems: "center", gap: "1rem",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 8px 28px rgba(201,24,74,0.18)"
          : "0 2px 12px rgba(201,24,74,0.08)",
        transform: hovered ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.2s ease",
        textAlign: "left",
        fontFamily: "inherit",
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Emoji circle */}
      <div style={{
        width: "52px", height: "52px",
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${gradientColors(card.key)[0]}, ${gradientColors(card.key)[1]})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem",
        flexShrink: 0,
        boxShadow: `0 4px 14px ${gradientColors(card.key)[2]}`,
      }}>
        {card.emoji}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <p style={{
          margin: 0,
          fontSize: "0.98rem",
          fontWeight: 800,
          color: "#c9184a",
          lineHeight: 1.3,
        }}>
          {card.label}
        </p>
        <p style={{
          margin: "0.15rem 0 0",
          fontSize: "0.75rem",
          color: "#e8799a",
          fontWeight: 600,
        }}>
          {card.desc}
        </p>
      </div>

      {/* Arrow */}
      <span style={{
        color: "#ffb3c8",
        fontSize: "1.1rem",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "transform 0.2s ease",
        flexShrink: 0,
      }}>
        →
      </span>
    </button>
  );
}

function gradientColors(key) {
  const map = {
    assessment: ["#ff85a1", "#f94f73", "rgba(249,79,115,0.25)"],
    selftest:   ["#ff6b8a", "#e8395a", "rgba(232,57,90,0.25)"],
    doctor:     ["#d163e0", "#f94f73", "rgba(209,99,224,0.25)"],
    exercise:   ["#ffaec0", "#ff6b8a", "rgba(255,107,138,0.25)"],
    diet:       ["#ff99b4", "#f06292", "rgba(240,98,146,0.25)"],
  };
  return map[key] || ["#f94f73", "#c9184a", "rgba(201,24,74,0.25)"];
}