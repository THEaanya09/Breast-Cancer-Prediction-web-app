import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";

// ── Meal plan generator ──────────────────────────────────────────────────
function generateMealPlan({ age, weight, activity, symptoms, preference }) {
  const isVeg   = preference === "vegetarian" || preference === "vegan";
  const isVegan = preference === "vegan";
  const ageNum  = parseInt(age, 10) || 30;
  const wt      = parseInt(weight, 10) || 60;

  // BMR-based hydration
  const hydrationLitres = Math.max(2, Math.round((wt * 0.033) * 10) / 10);

  // Iron-rich based on symptoms
  const ironFoods = isVegan
    ? ["Spinach & lentil soup", "Pumpkin seeds", "Fortified cereals", "Tofu stir-fry", "Chickpeas"]
    : ["Lean chicken", "Spinach dal", "Eggs", "Pumpkin seeds", "Fish curry"];

  const morning = [];
  const lunch   = [];
  const evening = [];
  const dinner  = [];

  // Morning
  morning.push("Warm water with lemon + soaked nuts (5–7 almonds)");
  if (isVegan) {
    morning.push("Oats with almond milk, banana, and chia seeds");
  } else if (isVeg) {
    morning.push("Idli / Upma with coconut chutney, or multigrain toast with peanut butter");
  } else {
    morning.push("2 boiled eggs + multigrain toast, or oats with milk and seasonal fruit");
  }
  if (ageNum >= 40) morning.push("1 tsp flaxseed powder mixed in warm water (supports hormonal balance)");
  if (symptoms.includes("irregular")) morning.push("Ginger tea to ease cramps and regulate cycle");

  // Lunch
  if (isVegan) {
    lunch.push("Brown rice / quinoa + dal + sautéed vegetables");
    lunch.push("Mixed salad with cucumber, tomato, sprouts, and lemon dressing");
  } else if (isVeg) {
    lunch.push("2 rotis + paneer sabzi / rajma + curd + salad");
    lunch.push("Include one serving of seasonal green vegetable");
  } else {
    lunch.push("2 rotis / 1 cup rice + chicken/fish curry + salad + curd");
    lunch.push("Include one serving of green vegetables");
  }
  if (activity === "high") lunch.push("Add an extra roti or ½ cup rice for energy needs");

  // Evening
  evening.push("Green tea or herbal tea (no sugar)");
  if (isVegan) {
    evening.push("Handful of mixed seeds (sunflower, pumpkin) + seasonal fruit");
  } else {
    evening.push("Roasted chana / makhana OR one small fruit (banana, apple, or guava)");
  }
  if (symptoms.includes("fatigue")) evening.push("Dates (2–3) for quick iron and energy boost");

  // Dinner
  dinner.push("Keep dinner light — eat at least 2 hours before sleeping");
  if (isVegan) {
    dinner.push("Vegetable soup + tofu stir-fry with brown rice or millet");
  } else if (isVeg) {
    dinner.push("Khichdi / moong dal + sabzi OR 2 rotis + dal + light sabzi");
  } else {
    dinner.push("Grilled fish / chicken soup + sautéed vegetables + 1–2 rotis");
  }
  dinner.push("Avoid fried, spicy, or heavy foods at night");
  if (ageNum >= 40) dinner.push("Warm turmeric milk before bed (supports bone health)");

  return { morning, lunch, evening, dinner, hydrationLitres, ironFoods };
}

// ── Component ─────────────────────────────────────────────────────────────
export default function Diet() {
  const navigate = useNavigate();
  const lang     = localStorage.getItem("lang") || "en";
  const t        = translations[lang] || translations["en"];

  const [step, setStep]       = useState("form"); // "form" | "plan"
  const [form, setForm]       = useState({
    age:        "",
    weight:     "",
    activity:   "moderate",
    symptoms:   [],
    preference: "non-vegetarian",
    phone:      "",
  });
  const [plan, setPlan]       = useState(null);

  const symptomOptions = [
    { value: "irregular", label: t.symptomIrregular || "Irregular periods" },
    { value: "fatigue",   label: t.symptomFatigue   || "Fatigue / Low energy" },
    { value: "pain",      label: t.symptomPain      || "Breast / Pelvic pain" },
    { value: "bloating",  label: t.symptomBloating  || "Bloating" },
    { value: "none",      label: t.symptomNone      || "No symptoms" },
  ];

  const toggle = (field, val) => {
    setForm((f) => {
      const arr = f[field];
      return { ...f, [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  };

  const handleGenerate = () => {
    const result = generateMealPlan(form);
    setPlan(result);
    setStep("plan");
  };

  const valid = form.age && form.weight;

  // ── FORM ──────────────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>

          {/* Header */}
          <div style={headerRow}>
            <button onClick={() => navigate("/dashboard")} style={linkBtn}>{t.back || "← Back"}</button>
            <span style={brandStyle}>HerHealth AI 💖</span>
            <div style={{ width: "60px" }} />
          </div>

          <h2 style={titleStyle}>{t.diet || "Diet & Nutrition"}</h2>
          <p style={subtitleStyle}>{t.dietSubtitle || "Tell us about yourself and we'll create your personalised meal plan."}</p>

          {/* Form card */}
          <div style={cardStyle}>

            {/* Age + Weight */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <p style={fieldLabel}>{t.ageLabel || "Age"}</p>
                <input
                  type="number" min="10" max="99" placeholder="e.g. 28"
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={fieldLabel}>{t.weightLabel || "Weight (kg)"}</p>
                <input
                  type="number" min="20" max="200" placeholder="e.g. 58"
                  value={form.weight}
                  onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Activity level */}
            <p style={fieldLabel}>{t.activityLabel || "Activity Level"}</p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              {[
                { v: "low",      l: t.activityLow      || "Low" },
                { v: "moderate", l: t.activityModerate  || "Moderate" },
                { v: "high",     l: t.activityHigh      || "High" },
              ].map(({ v, l }) => (
                <button key={v} onClick={() => setForm((f) => ({ ...f, activity: v }))}
                  style={{ flex: 1, padding: "0.6rem", borderRadius: "12px", border: `2px solid ${form.activity === v ? "#f94f73" : "#ffc2d4"}`, background: form.activity === v ? "#fff0f5" : "white", color: form.activity === v ? "#c9184a" : "#9ca3af", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Dietary preference */}
            <p style={fieldLabel}>{t.preferenceLabel || "Dietary Preference"}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem" }}>
              {[
                { v: "non-vegetarian", l: t.prefNonVeg  || "Non-Vegetarian" },
                { v: "vegetarian",     l: t.prefVeg      || "Vegetarian" },
                { v: "vegan",          l: t.prefVegan    || "Vegan" },
              ].map(({ v, l }) => (
                <button key={v} onClick={() => setForm((f) => ({ ...f, preference: v }))}
                  style={{ padding: "0.7rem 1rem", borderRadius: "12px", border: `2px solid ${form.preference === v ? "#f94f73" : "#ffc2d4"}`, background: form.preference === v ? "linear-gradient(135deg,#fff0f5,#ffe4ec)" : "white", color: form.preference === v ? "#c9184a" : "#6b7280", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                  {form.preference === v ? "✓ " : ""}{l}
                </button>
              ))}
            </div>

            {/* Symptoms */}
            <p style={fieldLabel}>{t.symptomsLabel || "Current Symptoms (select all that apply)"}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "1rem" }}>
              {symptomOptions.map(({ value, label: lbl }) => {
                const sel = form.symptoms.includes(value);
                return (
                  <button key={value} onClick={() => toggle("symptoms", value)}
                    style={{ padding: "0.45rem 0.9rem", borderRadius: "999px", border: `2px solid ${sel ? "#f94f73" : "#ffc2d4"}`, background: sel ? "#fff0f5" : "white", color: sel ? "#c9184a" : "#9ca3af", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                    {sel ? "✓ " : ""}{lbl}
                  </button>
                );
              })}
            </div>

            {/* Phone (UI only) */}
            <p style={fieldLabel}>{t.phoneLabel || "Phone Number (optional)"}</p>
            <input
              type="tel" placeholder={t.phonePlaceholder || "For diet reminders (optional)"}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              style={{ ...inputStyle, marginBottom: "0.25rem" }}
            />
            <p style={{ color: "#94a3b8", fontSize: "0.68rem", marginBottom: "1.2rem" }}>
              {t.phoneNote || "🔒 Not stored or shared. For reference only."}
            </p>

            <button onClick={handleGenerate} disabled={!valid}
              style={{ ...primaryBtn, opacity: valid ? 1 : 0.55, cursor: valid ? "pointer" : "not-allowed" }}>
              {t.generatePlan || "Generate My Meal Plan"}
            </button>
          </div>
        </div>
        <style>{googleFont}</style>
      </div>
    );
  }

  // ── MEAL PLAN ─────────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        {/* Header */}
        <div style={headerRow}>
          <button onClick={() => setStep("form")} style={linkBtn}>{t.back || "← Back"}</button>
          <span style={brandStyle}>HerHealth AI 💖</span>
          <div style={{ width: "60px" }} />
        </div>

        <h2 style={titleStyle}>{t.yourMealPlan || "Your Meal Plan"}</h2>
        <p style={subtitleStyle}>{t.mealPlanSubtitle || "Personalised just for you — based on your body and lifestyle."}</p>

        {/* Meal sections */}
        {[
          { icon: "🌅", heading: t.morning || "Morning", items: plan.morning, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
          { icon: "☀️", heading: t.lunch   || "Lunch",   items: plan.lunch,   color: "#22c55e", bg: "#f0fdf4", border: "#86efac" },
          { icon: "🌤",  heading: t.evening || "Evening", items: plan.evening, color: "#a78bfa", bg: "#f5f3ff", border: "#c4b5fd" },
          { icon: "🌙", heading: t.dinner  || "Dinner",  items: plan.dinner,  color: "#60a5fa", bg: "#eff6ff", border: "#bfdbfe" },
        ].map(({ icon, heading, items, color, bg, border }) => (
          <div key={heading} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: "20px", padding: "1.1rem 1.3rem", marginBottom: "0.85rem" }}>
            <p style={{ color, fontWeight: 900, fontSize: "0.9rem", margin: "0 0 0.65rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {icon} {heading}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {items.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                  <span style={{ color, marginTop: "0.25rem", flexShrink: 0, fontSize: "0.8rem" }}>•</span>
                  <span style={{ color: "#374151", fontSize: "0.83rem", lineHeight: 1.55 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Hydration */}
        <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "20px", padding: "1rem 1.3rem", marginBottom: "0.85rem" }}>
          <p style={{ color: "#3b82f6", fontWeight: 900, fontSize: "0.88rem", margin: "0 0 0.4rem" }}>
            💧 {t.hydrationTitle || "Hydration Goal"}
          </p>
          <p style={{ color: "#374151", fontSize: "0.83rem", margin: 0 }}>
            {t.hydrationMsg
              ? t.hydrationMsg.replace("{n}", plan.hydrationLitres)
              : `Drink at least ${plan.hydrationLitres} litres of water daily. Start your day with warm water and keep a bottle nearby.`}
          </p>
        </div>

        {/* Iron-rich foods */}
        <div style={{ background: "#fff1f2", border: "1.5px solid #fda4af", borderRadius: "20px", padding: "1rem 1.3rem", marginBottom: "1.25rem" }}>
          <p style={{ color: "#f43f5e", fontWeight: 900, fontSize: "0.88rem", margin: "0 0 0.65rem" }}>
            🩸 {t.ironTitle || "Iron-Rich Foods to Include"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {plan.ironFoods.map((food, i) => (
              <span key={i} style={{ background: "white", border: "1.5px solid #fda4af", borderRadius: "999px", padding: "0.3rem 0.85rem", color: "#f43f5e", fontWeight: 700, fontSize: "0.75rem" }}>
                {food}
              </span>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background: "rgba(255,182,207,0.22)", border: "1px solid rgba(249,100,130,0.18)", borderRadius: "12px", padding: "0.7rem 1rem", marginBottom: "1.2rem", textAlign: "center" }}>
          <p style={{ color: "#e8799a", fontSize: "0.68rem", margin: 0 }}>
            {t.dietDisclaimer || "⚠️ This is a general dietary guide. Please consult a registered dietitian for personalised medical nutrition therapy."}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => setStep("form")} style={{ ...outlineBtn, flex: 1 }}>
            {t.regenerate || "Regenerate"}
          </button>
          <button onClick={() => navigate("/dashboard")} style={{ ...primaryBtn, flex: 1 }}>
            {t.goHome || "Dashboard"}
          </button>
        </div>

      </div>
      <style>{googleFont}</style>
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────
const googleFont = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`;
const pageStyle      = { minHeight: "100vh", background: "linear-gradient(135deg,#fff0f5 0%,#ffe4ec 45%,#ffd6e7 100%)", fontFamily: "'Nunito', system-ui, sans-serif", padding: "0 0 3rem" };
const containerStyle = { maxWidth: "420px", margin: "0 auto", padding: "0 1.25rem" };
const headerRow      = { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "2.5rem", marginBottom: "1.25rem" };
const brandStyle     = { color: "#c9184a", fontWeight: 900, fontSize: "1rem" };
const titleStyle     = { fontSize: "1.4rem", fontWeight: 900, color: "#c9184a", margin: "0 0 0.25rem" };
const subtitleStyle  = { color: "#e8799a", fontSize: "0.83rem", fontWeight: 600, marginBottom: "1.25rem" };
const cardStyle      = { background: "white", borderRadius: "20px", boxShadow: "0 2px 12px rgba(201,24,74,0.08)", border: "1.5px solid rgba(249,100,130,0.12)", padding: "1.3rem", marginBottom: "1rem" };
const fieldLabel     = { color: "#c9184a", fontWeight: 800, fontSize: "0.78rem", marginBottom: "0.4rem", marginTop: 0 };
const inputStyle     = { width: "100%", border: "2px solid #ffc2d4", borderRadius: "12px", padding: "0.75rem 1rem", fontSize: "0.9rem", fontFamily: "'Nunito', sans-serif", color: "#374151", fontWeight: 600, outline: "none", background: "#fff5f8", boxSizing: "border-box" };
const primaryBtn     = { width: "100%", padding: "1rem", background: "linear-gradient(135deg,#f94f73 0%,#c9184a 100%)", color: "white", border: "none", borderRadius: "14px", fontSize: "0.95rem", fontWeight: 800, fontFamily: "'Nunito', sans-serif", cursor: "pointer", boxShadow: "0 6px 20px rgba(201,24,74,0.28)" };
const outlineBtn     = { width: "100%", padding: "1rem", background: "white", border: "2px solid #ffc2d4", color: "#c9184a", borderRadius: "14px", fontSize: "0.95rem", fontWeight: 800, fontFamily: "'Nunito', sans-serif", cursor: "pointer" };
const linkBtn        = { color: "#e8799a", fontWeight: 700, fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif" };