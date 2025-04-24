import React from "react";
import { Link } from "react-router-dom";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="bg-pitch text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="GoalSight" className="h-10 w-auto" />
          <Link to="/">
            <span className="text-2xl font-extrabold hover:text-goal transition-colors">
              GoalSight
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex items-center space-x-4">
          <Link
            to="/schedule"
            className="px-4 py-2 rounded bg-pitch-dark hover:bg-pitch transition-colors"
          >
            Schedule 
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-pitch-dark hover:bg-pitch transition-colors"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>
    </header>
  );
}
