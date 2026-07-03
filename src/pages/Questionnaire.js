import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import ProgressBar from "../components/ProgressBar";
import { translations } from "../utils/translations";

// Questions come from translations — no hardcoded array needed

export default function Questionnaire() {
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang") || "en";
  const t = translations[lang] || translations["en"];
  const questions = t.questions;   // ← translated questions for selected language

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (opt) => setSelected(opt);

  const handleNext = () => {
    if (!selected) return;

    setAnswers((prev) => ({ ...prev, [current]: selected }));

    if (current === questions.length - 1) {
      // Save and go to result
      localStorage.setItem("herhealth_answers", JSON.stringify({ ...answers, [current]: selected }));
      navigate("/result");
      return;
    }

    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => prev + 1);
      setSelected(answers[current + 1] || null);
      setAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    if (current === 0) { navigate("/language"); return; }
    setAnswers((prev) => ({ ...prev, [current]: selected }));
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => prev - 1);
      setSelected(answers[current - 1] || null);
      setAnimating(false);
    }, 300);
  };

  const isLast = current === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col px-5 py-8">
      {/* Header */}
      <div className="max-w-sm mx-auto w-full mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="text-pink-400 hover:text-pink-600 text-sm font-medium flex items-center gap-1">
            {t.back}
          </button>
          <span className="text-pink-600 font-extrabold text-lg">HerHealth AI 💖</span>
          <div className="w-12" />
        </div>
        <ProgressBar current={current} total={questions.length} questionLabel={t.question} ofLabel={t.of} />
      </div>

      {/* Card */}
      <div
        className={`max-w-sm mx-auto w-full flex-1 transition-all duration-300 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <QuestionCard
          question={questions[current].question}
          options={questions[current].options}
          selected={selected}
          onSelect={handleSelect}
          label={t.question}
        />
      </div>

      {/* Next Button */}
      <div className="max-w-sm mx-auto w-full mt-8">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-md
            ${selected
              ? "bg-pink-500 hover:bg-pink-600 active:scale-95 text-white"
              : "bg-pink-200 text-pink-300 cursor-not-allowed"
            }`}
        >
          {isLast ? t.result : t.next}
        </button>
        <p className="text-center text-gray-300 text-xs mt-3">
          {t.privacy}
        </p>
      </div>
    </div>
  );
}