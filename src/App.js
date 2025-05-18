import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NotesPage from "./pages/NotesPage";
import FlashcardsPage from "./pages/FlashcardsPage";

export default function App() {
  // Dark mode with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-purple-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<NotesPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
