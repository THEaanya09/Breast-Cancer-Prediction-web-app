import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";

// ── Yoga routine data ────────────────────────────────────────────────────
const YOGA_POSES = [
  {
    name:  "Child's Pose",
    nameKey: "yogaPose1",
    desc:  "Kneel and sit back on your heels. Fold forward, arms stretched ahead. Breathe deeply into your back.",
    descKey: "yogaDesc1",
    gif:   "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    duration: 300,
  },
  {
    name:  "Cat-Cow Stretch",
    nameKey: "yogaPose2",
    desc:  "On all fours, inhale and arch your back (Cow). Exhale and round it (Cat). Repeat slowly.",
    descKey: "yogaDesc2",
    gif:   "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
    duration: 300,
  },
  {
    name:  "Standing Forward Fold",
    nameKey: "yogaPose3",
    desc:  "Stand tall, then hinge at hips and fold forward. Let your head hang heavy. Feel the spine lengthen.",
    descKey: "yogaDesc3",
    gif:   "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80",
    duration: 300,
  },
  {
    name:  "Warrior II",
    nameKey: "yogaPose4",
    desc:  "Step feet wide apart. Bend front knee. Open arms wide. Gaze over your front hand. Stay strong.",
    descKey: "yogaDesc4",
    gif:   "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80",
    duration: 300,
  },
  {
    name:  "Seated Twist",
    nameKey: "yogaPose5",
    desc:  "Sit tall, cross one leg, and twist toward it. Look over your shoulder. Hold and breathe deeply.",
    descKey: "yogaDesc5",
    gif:   "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&q=80",
    duration: 300,
  },
  {
    name:  "Legs Up the Wall",
    nameKey: "yogaPose6",
    desc:  "Lie on your back, legs resting against a wall at 90 degrees. Close your eyes and fully relax.",
    descKey: "yogaDesc6",
    gif:   "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=400&q=80",
    duration: 300,
  },
];

// Breathing cycle: Inhale 4s → Hold 4s → Exhale 4s = 12s per cycle
const BREATHING_PHASES = ["Breathe In", "Hold", "Breathe Out"];
const PHASE_KEYS       = ["breatheIn", "hold", "breatheOut"];
const PHASE_DURATION   = 4; // seconds each
const BREATHING_TOTAL  = 15 * 60; // 15 minutes

// ── Helpers ──────────────────────────────────────────────────────────────
function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// ── Component ─────────────────────────────────────────────────────────────
export default function Exercise() {
  const navigate    = useNavigate();
  const lang        = localStorage.getItem("lang") || "en";
  const t           = translations[lang] || translations["en"];

  // Phase: "breathing" | "yoga" | "done"
  const [phase,        setPhase]        = useState("breathing");

  // Breathing state
  const [breathTime,   setBreathTime]   = useState(BREATHING_TOTAL);
  const [breathRunning,setBreathRunning]= useState(false);
  const [breathPhase,  setBreathPhase]  = useState(0); // 0=in 1=hold 2=out
  const [phaseTimer,   setPhaseTimer]   = useState(PHASE_DURATION);

  // Yoga state
  const [poseIdx,      setPoseIdx]      = useState(0);
  const [poseTime,     setPoseTime]     = useState(YOGA_POSES[0].duration);
  const [poseRunning,  setPoseRunning]  = useState(false);
  const [imgError,     setImgError]     = useState({});

  const breathRef = useRef(null);
  const poseRef   = useRef(null);
  const phaseRef  = useRef(null);

  // ── Breathing tick ───────────────────────────────────────────────────
  const startBreathing = useCallback(() => setBreathRunning(true), []);
  const pauseBreathing = useCallback(() => {
    setBreathRunning(false);
    clearInterval(breathRef.current);
    clearInterval(phaseRef.current);
  }, []);

  useEffect(() => {
    if (!breathRunning) return;
    breathRef.current = setInterval(() => {
      setBreathTime((prev) => {
        if (prev <= 1) {
          clearInterval(breathRef.current);
          setBreathRunning(false);
          setPhase("yoga");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(breathRef.current);
  }, [breathRunning]);

  // Phase cycle within breathing
  useEffect(() => {
    if (!breathRunning) return;
    setPhaseTimer(PHASE_DURATION);
    phaseRef.current = setInterval(() => {
      setPhaseTimer((p) => {
        if (p <= 1) {
          setBreathPhase((bp) => (bp + 1) % 3);
          return PHASE_DURATION;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(phaseRef.current);
  }, [breathRunning, breathPhase]);

  // ── Yoga tick ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!poseRunning) return;
    poseRef.current = setInterval(() => {
      setPoseTime((prev) => {
        if (prev <= 1) {
          clearInterval(poseRef.current);
          if (poseIdx < YOGA_POSES.length - 1) {
            setPoseIdx((i) => i + 1);
            setPoseTime(YOGA_POSES[poseIdx + 1]?.duration || 300);
            setPoseRunning(false);
          } else {
            setPoseRunning(false);
            setPhase("done");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(poseRef.current);
  }, [poseRunning, poseIdx]);

  const skipPose = () => {
    clearInterval(poseRef.current);
    setPoseRunning(false);
    if (poseIdx < YOGA_POSES.length - 1) {
      setPoseIdx((i) => i + 1);
      setPoseTime(YOGA_POSES[poseIdx + 1]?.duration || 300);
    } else {
      setPhase("done");
    }
  };

  const goToYoga = () => {
    clearInterval(breathRef.current);
    clearInterval(phaseRef.current);
    setBreathRunning(false);
    setPhase("yoga");
  };

  // Breathing ring progress
  const breathProgress = ((BREATHING_TOTAL - breathTime) / BREATHING_TOTAL) * 100;
  const bCirc = 2 * Math.PI * 52;
  const bDash  = (breathProgress / 100) * bCirc;

  // Pose ring progress
  const poseTotal    = YOGA_POSES[poseIdx].duration;
  const poseProgress = ((poseTotal - poseTime) / poseTotal) * 100;
  const pCirc = 2 * Math.PI * 40;
  const pDash  = (poseProgress / 100) * pCirc;

  const pose = YOGA_POSES[poseIdx];

  // Phase colors
  const phaseColors = ["#4ade80", "#f59e0b", "#60a5fa"];
  const phaseColor  = phaseColors[breathPhase];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f8fff8 0%, #f0f9ff 50%, #fef0f5 100%)",
      fontFamily: "'Nunito', system-ui, sans-serif",
      padding: "0 0 3rem",
    }}>
      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "0 1.25rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "2.5rem", marginBottom: "1.5rem" }}>
          <button onClick={() => navigate("/dashboard")} style={linkBtn}>
            {t.back || "← Back"}
          </button>
          <span style={{ color: "#c9184a", fontWeight: 900, fontSize: "1rem" }}>HerHealth AI 💖</span>
          <div style={{ width: "60px" }} />
        </div>

        {/* ══════════ BREATHING PHASE ══════════ */}
        {phase === "breathing" && (
          <>
            <SectionPill label={t.breathing || "Breathing Exercise — 15 min"} color="#4ade80" />

            <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.83rem", marginBottom: "1.5rem" }}>
              {t.breathingSubtitle || "Follow the breathing cycle to calm your mind and body."}
            </p>

            {/* Big breathing ring */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={phaseColor} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={`${bDash} ${bCirc}`}
                    style={{ transition: "stroke-dasharray 0.9s ease, stroke 1s ease" }} />
                </svg>
                <div style={{ textAlign: "center", zIndex: 1 }}>
                  <p style={{ fontSize: "2rem", fontWeight: 900, color: "#1e293b", margin: 0 }}>{fmt(breathTime)}</p>
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: 0 }}>remaining</p>
                </div>
              </div>

              {/* Phase indicator */}
              <div style={{
                marginTop: "1.2rem",
                background: "white",
                border: `2px solid ${phaseColor}`,
                borderRadius: "999px",
                padding: "0.5rem 1.6rem",
                boxShadow: `0 4px 16px ${phaseColor}44`,
                transition: "all 0.6s ease",
              }}>
                <p style={{ color: phaseColor, fontWeight: 900, fontSize: "1rem", margin: 0, transition: "color 0.6s" }}>
                  {t[PHASE_KEYS[breathPhase]] || BREATHING_PHASES[breathPhase]}
                </p>
              </div>

              <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                {phaseTimer}s
              </p>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <button
                onClick={breathRunning ? pauseBreathing : startBreathing}
                style={{ ...primaryBtn, flex: 1 }}
              >
                {breathRunning ? (t.stop || "Pause") : (t.start || "Start")}
              </button>
              <button onClick={goToYoga} style={{ ...outlineBtn, flex: 1, padding: "0.9rem" }}>
                {t.skipToYoga || "Skip to Yoga"}
              </button>
            </div>

            {/* Phase guide */}
            <div style={cardStyle}>
              <p style={label}>Breathing Pattern</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[["Breathe In", t.breatheIn || "Breathe In", "4s", "#4ade80"], ["Hold", t.hold || "Hold", "4s", "#f59e0b"], ["Breathe Out", t.breatheOut || "Breathe Out", "4s", "#60a5fa"]].map(([, name, dur, col]) => (
                  <div key={name} style={{ flex: 1, background: `${col}18`, border: `1.5px solid ${col}55`, borderRadius: "12px", padding: "0.6rem 0.4rem", textAlign: "center" }}>
                    <p style={{ color: col, fontWeight: 800, fontSize: "0.75rem", margin: 0 }}>{name}</p>
                    <p style={{ color: "#94a3b8", fontSize: "0.7rem", margin: "0.1rem 0 0" }}>{dur}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════ YOGA PHASE ══════════ */}
        {phase === "yoga" && (
          <>
            <SectionPill label={t.exercise || "Yoga Routine — 30 min"} color="#f472b6" />

            {/* Progress bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
              <div style={{ flex: 1, height: "6px", background: "#ffe4ec", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{
                  width: `${((poseIdx) / YOGA_POSES.length) * 100}%`,
                  height: "100%", background: "linear-gradient(90deg,#f94f73,#c9184a)",
                  borderRadius: "999px", transition: "width 0.5s ease",
                }} />
              </div>
              <span style={{ color: "#c9184a", fontWeight: 800, fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                {poseIdx + 1} / {YOGA_POSES.length}
              </span>
            </div>

            {/* Pose card */}
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              {/* Image */}
              <div style={{ height: "180px", background: "#fff0f5", position: "relative", overflow: "hidden" }}>
                {!imgError[poseIdx] ? (
                  <img
                    src={pose.gif}
                    alt={pose.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                    onError={() => setImgError((p) => ({ ...p, [poseIdx]: true }))}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#ffd6e7,#ffe4ec)" }}>
                    <p style={{ color: "#c9184a", fontWeight: 800, fontSize: "0.9rem" }}>{pose.name}</p>
                  </div>
                )}
                {/* Pose title overlay */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.55))", padding: "1rem 1rem 0.75rem" }}>
                  <p style={{ color: "white", fontWeight: 900, fontSize: "1.05rem", margin: 0 }}>
                    {t[pose.nameKey] || pose.name}
                  </p>
                </div>
              </div>

              {/* Description + Timer */}
              <div style={{ padding: "1rem 1.2rem" }}>
                <p style={{ color: "#64748b", fontSize: "0.83rem", lineHeight: 1.55, marginBottom: "1rem" }}>
                  {t[pose.descKey] || pose.desc}
                </p>

                {/* Mini timer ring */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.9rem" }}>
                  <div style={{ position: "relative", width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }} viewBox="0 0 88 88">
                      <circle cx="44" cy="44" r="40" fill="none" stroke="#ffe4ec" strokeWidth="7" />
                      <circle cx="44" cy="44" r="40" fill="none" stroke="#f94f73" strokeWidth="7"
                        strokeLinecap="round" strokeDasharray={`${pDash} ${pCirc}`}
                        style={{ transition: "stroke-dasharray 0.9s linear" }} />
                    </svg>
                    <span style={{ fontWeight: 900, fontSize: "0.78rem", color: "#c9184a", zIndex: 1 }}>{fmt(poseTime)}</span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: 1.5 }}>
                    {t.holdPose || "Hold this pose and breathe deeply."}
                  </p>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button
                    onClick={() => setPoseRunning((r) => !r)}
                    style={{ ...primaryBtn, flex: 1, padding: "0.8rem" }}
                  >
                    {poseRunning ? (t.stop || "Pause") : (t.start || "Start")}
                  </button>
                  <button onClick={skipPose} style={{ ...outlineBtn, flex: 1, padding: "0.8rem" }}>
                    {t.nextExercise || "Skip"}
                  </button>
                </div>
              </div>
            </div>

            {/* All poses list */}
            <div style={{ marginTop: "1rem" }}>
              <p style={label}>All Poses</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {YOGA_POSES.map((p, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.6rem 0.9rem",
                    background: i === poseIdx ? "linear-gradient(135deg,#fff0f5,#ffe4ec)" : "white",
                    border: `1.5px solid ${i === poseIdx ? "#f94f73" : "rgba(249,100,130,0.12)"}`,
                    borderRadius: "12px",
                    opacity: i < poseIdx ? 0.45 : 1,
                  }}>
                    <span style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: i < poseIdx ? "#4ade80" : i === poseIdx ? "linear-gradient(135deg,#f94f73,#c9184a)" : "#f3f4f6",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.65rem", fontWeight: 800,
                      color: i <= poseIdx ? "white" : "#9ca3af", flexShrink: 0,
                    }}>
                      {i < poseIdx ? "✓" : i + 1}
                    </span>
                    <span style={{ color: i === poseIdx ? "#c9184a" : "#374151", fontWeight: i === poseIdx ? 800 : 600, fontSize: "0.82rem" }}>
                      {t[p.nameKey] || p.name}
                    </span>
                    <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.72rem" }}>5 min</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════ DONE PHASE ══════════ */}
        {phase === "done" && (
          <div style={{ textAlign: "center", paddingTop: "3rem" }}>
            <div style={{
              width: "100px", height: "100px", borderRadius: "50%",
              background: "linear-gradient(135deg,#f94f73,#c9184a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem", fontSize: "2.5rem",
              boxShadow: "0 8px 32px rgba(201,24,74,0.3)",
            }}>
              💖
            </div>
            <h2 style={{ color: "#c9184a", fontWeight: 900, fontSize: "1.6rem", marginBottom: "0.5rem" }}>
              {t.exerciseDone || "Amazing Work!"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              {t.exerciseDoneMsg || "You completed your breathing and yoga session. Your body and mind thank you."}
            </p>
            <button onClick={() => navigate("/dashboard")} style={primaryBtn}>
              {t.goHome || "Back to Dashboard"}
            </button>
          </div>
        )}

      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
    </div>
  );
}

// ── Sub-components
function SectionPill({ label, color }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "0.4rem",
      background: `${color}18`, border: `1.5px solid ${color}55`,
      borderRadius: "999px", padding: "0.35rem 1rem",
      marginBottom: "0.75rem",
    }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, display: "inline-block" }} />
      <span style={{ color, fontWeight: 800, fontSize: "0.78rem" }}>{label}</span>
    </div>
  );
}

// ── Shared styles
const linkBtn    = { color: "#e8799a", fontWeight: 700, fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" };
const cardStyle  = { background: "white", borderRadius: "20px", boxShadow: "0 2px 12px rgba(201,24,74,0.08)", border: "1.5px solid rgba(249,100,130,0.12)", marginBottom: "1rem" };
const label      = { color: "#c9184a", fontWeight: 800, fontSize: "0.78rem", marginBottom: "0.6rem", marginTop: 0 };
const primaryBtn = { width: "100%", padding: "1rem", background: "linear-gradient(135deg,#f94f73 0%,#c9184a 100%)", color: "white", border: "none", borderRadius: "14px", fontSize: "0.95rem", fontWeight: 800, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 20px rgba(201,24,74,0.28)" };
const outlineBtn = { width: "100%", padding: "1rem", background: "white", border: "2px solid #ffc2d4", color: "#c9184a", borderRadius: "14px", fontSize: "0.95rem", fontWeight: 800, fontFamily: "inherit", cursor: "pointer" };