import React from "react";

export default function QuestionCard({ question, options, selected, onSelect, label }) {
  return (
    <div className="w-full">
      {/* Question */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6 border border-pink-100">
        <p className="text-xs font-semibold text-pink-300 uppercase tracking-widest mb-3">
          {label || "Question"}
        </p>
        <h3 className="text-gray-700 font-bold text-lg leading-snug">
          {question}
        </h3>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <button
              key={i}
              onClick={() => onSelect(opt)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-medium text-sm transition-all duration-200 border-2 shadow-sm active:scale-95
                ${
                  isSelected
                    ? "bg-pink-500 text-white border-pink-500 shadow-md"
                    : "bg-white text-gray-600 border-pink-100 hover:border-pink-300 hover:bg-pink-50"
                }`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3
                ${isSelected ? "bg-white text-pink-500" : "bg-pink-100 text-pink-400"}`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}