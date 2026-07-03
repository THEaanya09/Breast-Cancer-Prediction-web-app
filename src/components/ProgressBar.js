import React from "react";

export default function ProgressBar({ current, total }) {
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-pink-400 font-semibold">
          Question {current + 1} of {total}
        </span>
        <span className="text-xs text-pink-500 font-bold">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
