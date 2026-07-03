import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";
import { findNearbyDoctor } from "./Dashboard";

// ── Helpers ────────────────────────────────────────────────────────────────

function parseQAnswers() {
  try {
    const raw = JSON.parse(localStorage.getItem("herhealth_answers") || "{}");
    const keys = Object.keys(raw);
    if (!keys.length) return null;
    let points = 0;
    keys.forEach((k) => {
      const v = raw[k] || "";
      if (v.startsWith("Yes") || v.includes("Noticeable") || v.includes("Close") || v.includes("Above") || v.includes("Never") || v.includes("Frequent") || v.includes("महसूस") || v.includes("ஆம்") || v.includes("అవును") || v.includes("हाँ") || v.includes("ہاں") || v.includes("ਹਾਂ") || v.includes("ഹൗദ") || v.includes("হ্যাঁ") || v.includes("ಹೌದ") || v.includes("हो"))
        points += 20;
      else if (v.includes("Occasional") || v.includes("Distant") || v.includes("More than") || v.includes("30") || v.includes("50"))
        points += 8;
    });
    return Math.min(100, points);
  } catch {
    return null;
  }
}

function getRiskInfo(score, t) {
  if (score <= 30)
    return {
      label: t.lowRisk,
      emoji: "🟢",
      color: "#22c55e",
      bgColor: "#f0fdf4",
      borderColor: "#86efac",
      ringColor: "#86efac",
      trackColor: "#f0fdf4",
      reasons: t.lowReasons,
      advice: t.lowAdvice,
      tone: t.lowTone || "You're doing great 💖 Keep taking care of yourself.",
      steps: t.lowSteps || ["Continue monthly self-examinations", "Schedule an annual check-up", "Maintain a healthy diet & exercise routine"],
    };
  if (score <= 70)
    return {
      label: t.mediumRisk,
      emoji: "🟡",
      color: "#f59e0b",
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      ringColor: "#fde68a",
      trackColor: "#fefce8",
      reasons: t.medReasons,
      advice: t.medAdvice,
      tone: t.medTone || "You're doing okay 🌸 A little extra care will make a big difference.",
      steps: t.medSteps || ["Book a clinical breast exam in the next 4 weeks", "Track any changes with a symptom diary", "Consult your doctor about a routine screening"],
    };
  return {
    label: t.highRisk,
    emoji: "🔴",
    color: "#f43f5e",
    bgColor: "#fff1f2",
    borderColor: "#fda4af",
    ringColor: "#fda4af",
    trackColor: "#fff1f2",
    reasons: t.highReasons,
    advice: t.highAdvice,
    tone: t.highTone || "Your health matters deeply 💗 Please consult a doctor as soon as possible.",
    steps: t.highSteps || ["See a gynecologist or oncologist immediately", "Request a mammogram or ultrasound", "Do not ignore any symptoms — early action saves lives"],
  };
}

function buildAIExplanation(t) {
  const bullets = [];
  try {
    const qa = JSON.parse(localStorage.getItem("herhealth_answers") || "{}");
    const sa = JSON.parse(localStorage.getItem("self_assessment") || "[]");

    // Questionnaire-based bullets
    Object.entries(qa).forEach(([, v]) => {
      if (!v) return;
      const vl = v.toLowerCase();
      if ((vl.includes("yes") || vl.includes("feel") || vl.includes("हाँ") || vl.includes("हो") || vl.includes("ਹਾਂ") || vl.includes("ہاں") || vl.includes("ஆம்") || vl.includes("అవున") || vl.includes("ಹೌದ") || vl.includes("ഹൗദ") || vl.includes("হ্যাঁ")) && bullets.length < 2) {
        if (v.includes("lump") || v.includes("feel") || v.includes("गांठ") || v.includes("गाठ") || v.includes("ගaṭṭu"))
          bullets.push(t.aiLump || "⚠️ A lump or thickening was reported — this is a key indicator worth discussing with a doctor.");
        else if (v.includes("pain") || v.includes("दर्द") || v.includes("நோவு") || v.includes("నొప్పి"))
          bullets.push(t.aiPain || "⚠️ Persistent breast pain was noted — while often benign, it should be monitored closely.");
        else if (v.includes("family") || v.includes("mother") || v.includes("sister") || v.includes("माँ") || v.includes("बहन"))
          bullets.push(t.aiFamily || "⚠️ Close family history of breast cancer significantly raises your risk profile.");
        else if (v.includes("50") || v.includes("above"))
          bullets.push(t.aiAge || "📊 Being above 50 is an established epidemiological risk factor for breast cancer.");
      }
    });

    // Self-assessment bullets
    sa.forEach((item) => {
      if (item.score >= 2 && bullets.length < 4) {
        bullets.push(`⚠️ ${t.aiSelfCheck || "Visual self-check flagged:"} ${item.title}`);
      }
    });
  } catch {}

  if (bullets.length === 0)
    bullets.push(t.aiNoFlags || "✅ No major red flags detected in your responses. Maintain regular check-ups.");

  return bullets;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Result() {
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang") || "en";
  const t = translations[lang] || translations["en"];

  // ── Combined Score
  const [score] = useState(() => {
    const selfRaw = parseInt(localStorage.getItem("self_score") || "0", 10);
    const selfPct = Math.min(100, (selfRaw / 12) * 100); // max 6 cards × 2 pts

    const qPts = parseQAnswers();
    const qPct = qPts !== null ? Math.min(100, qPts) : Math.floor(Math.random() * 60) + 10;

    const final = Math.round(0.6 * qPct + 0.4 * selfPct);
    return Math.min(95, Math.max(5, final));
  });

  const [displayScore, setDisplayScore] = useState(0);
  const risk = getRiskInfo(score, t);
  const aiBullets = buildAIExplanation(t);
  const circumference = 2 * Math.PI * 45;

  // Animated counter
  useEffect(() => {
    let s = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      s += step;
      if (s >= score) { setDisplayScore(score); clearInterval(timer); }
      else setDisplayScore(Math.floor(s));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const strokeDash = (displayScore / 100) * circumference;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff0f5 0%,#ffe4ec 45%,#ffd6e7 100%)",
        fontFamily: "'Nunito', system-ui, sans-serif",
        padding: "0 0 3rem",
      }}
    >
      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "0 1.25rem" }}>

        {/* ── Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "2.5rem", marginBottom: "1.5rem" }}>
          <button onClick={() => navigate("/")} style={linkStyle}>
            {t.goHome || "← Home"}
          </button>
          <span style={{ color: "#c9184a", fontWeight: 900, fontSize: "1.1rem" }}>HerHealth AI 💖</span>
          <div style={{ width: "60px" }} />
        </div>

        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 900, color: "#c9184a", margin: "0 0 0.3rem" }}>
          {t.yourResults || "Your Results"}
        </h2>
        <p style={{ textAlign: "center", color: "#e8799a", fontSize: "0.82rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          {t.basedOn || "Based on your responses"}
        </p>

        {/* ── Circular Score */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke={risk.trackColor} strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={risk.ringColor} strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                style={{ transition: "stroke-dasharray 0.05s linear" }}
              />
            </svg>
            <div style={{ textAlign: "center", zIndex: 1 }}>
              <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#374151", margin: 0, lineHeight: 1 }}>{displayScore}%</p>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: risk.color, margin: "0.2rem 0 0" }}>{risk.label}</p>
            </div>
          </div>
        </div>

        {/* ── Emotional Tone Card */}
        <div style={{
          background: `linear-gradient(135deg, ${risk.bgColor}, white)`,
          border: `2px solid ${risk.borderColor}`,
          borderRadius: "20px",
          padding: "1.2rem 1.4rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "1.6rem", margin: "0 0 0.4rem" }}>{risk.emoji}</p>
          <p style={{ fontWeight: 900, fontSize: "1.1rem", color: risk.color, margin: "0 0 0.4rem" }}>{risk.label}</p>
          <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>{risk.tone}</p>
        </div>

        {/* ── AI Explanation */}
        <div style={cardStyle}>
          <p style={sectionLabel}>{t.whyTitle || "📋 What your responses indicate"}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {aiBullets.map((b, i) => (
              <li key={i} style={{ fontSize: "0.83rem", color: "#374151", lineHeight: 1.55, background: "#fff5f8", borderRadius: "10px", padding: "0.6rem 0.9rem" }}>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Why this score */}
        <div style={cardStyle}>
          <p style={sectionLabel}>{t.whyTitle || "📋 Why this assessment?"}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {risk.reasons.map((r, i) => (
              <li key={i} style={{ display: "flex", gap: "0.5rem", color: "#4b5563", fontSize: "0.82rem", lineHeight: 1.5 }}>
                <span style={{ color: "#ffb3c8", marginTop: "0.2rem", flexShrink: 0 }}>•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Next Steps */}
        <div style={cardStyle}>
          <p style={sectionLabel}>{t.nextStepsTitle || "✅ Recommended Next Steps"}</p>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {risk.steps.map((s, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{
                  minWidth: "22px", height: "22px",
                  background: "linear-gradient(135deg,#f94f73,#c9184a)",
                  borderRadius: "50%", color: "#fff",
                  fontSize: "0.7rem", fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ color: "#374151", fontSize: "0.83rem", lineHeight: 1.5 }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Disclaimer */}
        <div style={{
          background: "rgba(255,182,207,0.25)",
          border: "1px solid rgba(249,100,130,0.2)",
          borderRadius: "12px", padding: "0.75rem 1rem",
          marginBottom: "1.25rem", textAlign: "center",
        }}>
          <p style={{ color: "#e8799a", fontSize: "0.7rem", margin: 0 }}>{t.disclaimer}</p>
        </div>

        {/* ── Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button onClick={() => navigate("/awareness")} style={primaryBtn}>
            {t.learnMore}
          </button>

          <button onClick={findNearbyDoctor} style={{
            ...primaryBtn,
            background: "linear-gradient(135deg,#e8395a 0%,#c9184a 100%)",
            boxShadow: "0 6px 20px rgba(201,24,74,0.32)",
          }}>
            🏥 {t.findDoctor || "Find Nearby Gynecologist"}
          </button>

          <button onClick={() => navigate("/contact")} style={outlineBtn}>
            {t.findHelp}
          </button>

          <button
            onClick={() => { localStorage.removeItem("herhealth_answers"); localStorage.removeItem("self_score"); localStorage.removeItem("self_assessment"); navigate("/self-assessment"); }}
            style={{ background: "none", border: "none", color: "#e8799a", fontSize: "0.82rem", textDecoration: "underline", textUnderlineOffset: "3px", cursor: "pointer", fontFamily: "inherit", marginTop: "0.25rem" }}
          >
            {t.retake}
          </button>
        </div>

      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
    </div>
  );
}

// ── Shared styles
const linkStyle = { color: "#e8799a", fontWeight: 700, fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" };
const cardStyle = { background: "white", borderRadius: "20px", boxShadow: "0 2px 12px rgba(201,24,74,0.08)", border: "1.5px solid rgba(249,100,130,0.12)", padding: "1.2rem 1.3rem", marginBottom: "1rem" };
const sectionLabel = { color: "#c9184a", fontWeight: 800, fontSize: "0.8rem", marginBottom: "0.75rem", marginTop: 0 };
const primaryBtn = {
  width: "100%", padding: "1rem",
  background: "linear-gradient(135deg,#f94f73 0%,#c9184a 100%)",
  color: "white", border: "none", borderRadius: "16px",
  fontSize: "0.95rem", fontWeight: 800, fontFamily: "inherit",
  cursor: "pointer", boxShadow: "0 6px 20px rgba(201,24,74,0.32)",
};
const outlineBtn = {
  width: "100%", padding: "0.9rem",
  background: "white", border: "2px solid #ffc2d4",
  color: "#c9184a", borderRadius: "16px",
  fontSize: "0.95rem", fontWeight: 800, fontFamily: "inherit",
  cursor: "pointer",
};