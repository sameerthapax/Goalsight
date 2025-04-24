import React, { useEffect, useState } from "react";
import { premierLeagueTeams } from "../data/plTeams";

export default function Schedule() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFixtures() {
      try {
        const res = await fetch(
          "https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4328&s=2024-2025"
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data.events) throw new Error("No events returned");

        const filtered = data.events.filter((m) => {
          const home = m.strHomeTeam?.trim();
          const away = m.strAwayTeam?.trim();
          return (
            premierLeagueTeams.some((t) => t.name === home) &&
            premierLeagueTeams.some((t) => t.name === away)
          );
        });

        setMatches(filtered);
      } catch (err) {
        console.error("Error loading fixtures:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFixtures();
  }, []);
  function getLogo(teamName) {
    const t = premierLeagueTeams.find((t) => t.name === teamName);
    return t ? t.logo : "";
  }

  if (loading) return <p className="text-center py-8">Loading fixtures…</p>;
  if (error)
    return (
      <p className="text-center py-8 text-red-500">
        Error loading fixtures: {error}
      </p>
    );
  if (matches.length === 0)
    return (
      <p className="text-center py-8">
        No upcoming Premier League fixtures found.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Past Premier League Fixtures
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {matches.map((m) => (
          <div
            key={m.idEvent}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center border-l-4 border-primary dark:border-primary hover:scale-[1.01] transition-transform"
          >
            <div className="flex-1 flex items-center space-x-3">
              {/* Home */}
              <div className="flex flex-col items-center">
                <img
                  src={getLogo(m.strHomeTeam)}
                  alt={m.strHomeTeam}
                  className="h-10 w-auto"
                />
                <span className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                  {m.strHomeTeam}
                </span>
              </div>

              {/* VS */}
              <span className="mx-2 text-lg font-extrabold text-gray-800 dark:text-gray-200">
                VS
              </span>

              {/* Away */}
              <div className="flex flex-col items-center">
                <img
                  src={getLogo(m.strAwayTeam)}
                  alt={m.strAwayTeam}
                  className="h-10 w-auto"
                />
                <span className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                  {m.strAwayTeam}
                </span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="ml-4 text-right">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {m.dateEvent}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {m.strTime}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
