import React, { useState } from "react";

export default function TeamDropdown({ label, teams, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selected = teams.find((t) => t.name === value);

  return (
    <div className="relative w-full mb-4">
      <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
      <div
        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 
                   bg-white dark:bg-gray-700 cursor-pointer flex items-center 
                   justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? (
          <div className="flex items-center space-x-2">
            <img src={selected.logo} alt={selected.name} className="h-5 w-5" />
            <span className="text-gray-700 dark:text-gray-200">{selected.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">-- Select Team --</span>
        )}

        <svg
          className={`h-4 w-4 ml-2 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown menu */}
      <div
        className={`
          absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border 
          border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-64 
          overflow-auto transition-all duration-300 transform origin-top 
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
      >
        {/* Search bar */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-600">
          <input
            type="text"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-500 
                       focus:outline-none focus:ring-1 focus:ring-primary 
                       dark:bg-gray-600 dark:text-gray-100"
            placeholder="Search team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ul>
          {filtered.map((team) => (
            <li
              key={team.name}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer 
                         flex items-center space-x-2"
              onClick={() => {
                onChange(team.name);
                setIsOpen(false);
                setSearchTerm("");
              }}
            >
              <img src={team.logo} alt={team.name} className="h-5 w-5" />
              <span className="text-gray-700 dark:text-gray-200">{team.name}</span>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
              No teams found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
