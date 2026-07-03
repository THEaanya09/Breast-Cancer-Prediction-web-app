import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Language from "./pages/Language";
import Dashboard from "./pages/Dashboard";
import SelfAssessment from "./pages/SelfAssessment";
import Questionnaire from "./pages/Questionnaire";
import Result from "./pages/Result";
import Awareness from "./pages/Awareness";
import Chatbot from "./pages/Chatbot";
import Contact from "./pages/Contact";
import Exercise from "./pages/Exercise";
import Diet from "./pages/Diet";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-pink-50 font-sans">
        <Routes>
          <Route path="/"                element={<LandingPage />} />
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/language"        element={<Language />} />
          <Route path="/self-assessment" element={<SelfAssessment />} />
          <Route path="/questionnaire"   element={<Questionnaire />} />
          <Route path="/result"          element={<Result />} />
          <Route path="/awareness"       element={<Awareness />} />
          <Route path="/chatbot"         element={<Chatbot />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/exercise"        element={<Exercise />} />
          <Route path="/diet"            element={<Diet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;