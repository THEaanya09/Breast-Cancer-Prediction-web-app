import React from "react";
import { useNavigate } from "react-router-dom";

export default function Language() {
  const navigate = useNavigate();

  const handleSelect = (lang) => {
    // Clear any previously stored language first, then set fresh
    localStorage.removeItem("lang");
    localStorage.setItem("lang", lang);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col items-center justify-center px-6">
      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-pink-400 hover:text-pink-600 text-sm font-medium flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="max-w-sm w-full text-center">
        {/* Heading */}
        <div className="mb-2">
          <span className="text-4xl">🌸</span>
        </div>
        <h2 className="text-3xl font-extrabold text-pink-700 mb-2">
          Choose Language
        </h2>
        <p className="text-gray-400 text-sm mb-10">
          Select your preferred language to continue
        </p>

        {/* Language Buttons — all 11 languages */}
        <div className="flex flex-col gap-3">
          {[
            { code: "en", flag: "🇬🇧", name: "English",    native: "Continue in English" },
            { code: "hi", flag: "🇮🇳", name: "हिन्दी",      native: "हिन्दी में जारी रखें" },
            { code: "bn", flag: "🇮🇳", name: "বাংলা",       native: "বাংলায় চালিয়ে যান" },
            { code: "ta", flag: "🇮🇳", name: "தமிழ்",       native: "தமிழில் தொடரவும்" },
            { code: "te", flag: "🇮🇳", name: "తెలుగు",      native: "తెలుగులో కొనసాగించు" },
            { code: "mr", flag: "🇮🇳", name: "मराठी",       native: "मराठीत सुरू ठेवा" },
            { code: "gu", flag: "🇮🇳", name: "ગુજરાતી",     native: "ગુજરાતીમાં ચાલુ રાખો" },
            { code: "kn", flag: "🇮🇳", name: "ಕನ್ನಡ",       native: "ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಸಿ" },
            { code: "ml", flag: "🇮🇳", name: "മലയാളം",     native: "മലയാളത്തിൽ തുടരുക" },
            { code: "pa", flag: "🇮🇳", name: "ਪੰਜਾਬੀ",      native: "ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਰੀ ਰੱਖੋ" },
            { code: "ur", flag: "🇮🇳", name: "اردو",        native: "اردو میں جاری رکھیں" },
          ].map(({ code, flag, name, native }) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className="w-full bg-white border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 active:scale-95 rounded-2xl py-4 px-5 shadow-md transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{flag}</span>
                <div className="text-left">
                  <p className="text-pink-700 font-bold text-base leading-tight">{name}</p>
                  <p className="text-gray-400 text-xs">{native}</p>
                </div>
              </div>
              <span className="text-pink-300 text-lg">→</span>
            </button>
          ))}
        </div>

        <p className="text-gray-300 text-xs mt-10">
          You can change this later from settings
        </p>
      </div>
    </div>
  );
}