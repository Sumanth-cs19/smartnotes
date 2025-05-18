import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header({ darkMode, setDarkMode }) {
  const location = useLocation();

  return (
    <header className="flex justify-between items-center bg-purple-300 dark:bg-purple-700 px-6 py-3 rounded-b-md shadow-md sticky top-0 z-50">
      <h1 className="text-2xl font-bold tracking-wide">Smart Notes & Flashcards</h1>
      <nav className="space-x-6">
        <Link
          to="/"
          className={`font-semibold hover:underline ${
            location.pathname === "/" ? "underline" : ""
          }`}
        >
          Notes
        </Link>
        <Link
          to="/flashcards"
          className={`font-semibold hover:underline ${
            location.pathname === "/flashcards" ? "underline" : ""
          }`}
        >
          Flashcards
        </Link>
      </nav>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-purple-600 dark:bg-purple-300 text-white dark:text-purple-800 px-3 py-1 rounded hover:bg-purple-700 dark:hover:bg-purple-400 transition"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}
