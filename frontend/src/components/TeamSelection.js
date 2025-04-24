import React, { useState, useEffect } from "react";

/**
 * 2023/2024 Premier League teams
 */
const premierLeagueTeams = [
  { name: "Arsenal", logo: "/logos/premier-league/Arsenal.png" },
  { name: "Aston Villa", logo: "/logos/premier-league/Aston Villa.png" },
  { name: "Bournemouth", logo: "/logos/premier-league/Bournemouth.png" },
  { name: "Brentford", logo: "/logos/premier-league/Brentford.png" },
  { name: "Brighton & Hove Albion", logo: "/logos/premier-league/Brighton & Hove Albion.png" },
  { name: "Leicester City", logo: "/logos/premier-league/Leicester City.png" },
  { name: "Chelsea", logo: "/logos/premier-league/Chelsea.png" },
  { name: "Crystal Palace", logo: "/logos/premier-league/Crystal Palace.png" },
  { name: "Everton", logo: "/logos/premier-league/Everton.png" },
  { name: "Fulham", logo: "/logos/premier-league/Fulham.png" },
  { name: "Liverpool", logo: "/logos/premier-league/Liverpool.png" },
  { name: "Ipswich Town", logo: "/logos/premier-league/Ipswich Town.png" },
  { name: "Manchester City", logo: "/logos/premier-league/Manchester City.png" },
  { name: "Manchester United", logo: "/logos/premier-league/Manchester United.png" },
  { name: "Newcastle United", logo: "/logos/premier-league/Newcastle United.png" },
  { name: "Nottingham Forest", logo: "/logos/premier-league/Nottingham Forest.png" },
  { name: "Southampton", logo: "/logos/premier-league/Southampton.png" },
  { name: "Tottenham Hotspur", logo: "/logos/premier-league/Tottenham Hotspur.png" },
  { name: "West Ham United", logo: "/logos/premier-league/West Ham United.png" },
  { name: "Wolverhampton Wanderers", logo: "/logos/premier-league/Wolverhampton Wanderers.png" },
];

// --------------------------------------------------------------------
// 1) A custom dropdown for selecting a team (w/ search + logos)
// --------------------------------------------------------------------
function TeamDropdown({ label, teams, value, onChange }) {
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

// --------------------------------------------------------------------
// TeamSelection component
// --------------------------------------------------------------------
export default function TeamSelection() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");

  // We'll store advanced stats for each side, e.g. { last5Summary, nextDate, nextOpponentLogo }
  const [homeStats, setHomeStats] = useState(null);
  const [awayStats, setAwayStats] = useState(null);

  const selectedHome = premierLeagueTeams.find((t) => t.name === homeTeam);
  const selectedAway = premierLeagueTeams.find((t) => t.name === awayTeam);

  //parse W/D/L from last 5 home matches
  function computeWDL(teamName, events) {
    let w = 0,
      d = 0,
      l = 0;
    for (let e of events) {
      const hs = parseInt(e.intHomeScore, 10);
      const as = parseInt(e.intAwayScore, 10);
      if (isNaN(hs) || isNaN(as)) continue;
      if (e.strHomeTeam === teamName) {
        if (hs > as) w++;
        else if (hs < as) l++;
        else d++;
      }
    }
    return { wCount: w, dCount: d, lCount: l };
  }

  // produce a color-coded summary like "3W 1D 1L"
  function colorCodedSummary(w, d, l) {
    return (
      <div className="space-x-1">
        <span className="text-green-600 dark:text-green-400 font-bold">{w}W</span>
        <span>{d}D</span>
        <span className="text-red-600 dark:text-red-400 font-bold">{l}L</span>
      </div>
    );
  }

  // -- Core fetch logic: last 5 home games + next fixture from TheSportsDB
  async function fetchTeamData(teamName) {
    if (!teamName) return null;
    try {
      // 1) get ID from 'searchteams.php'
      const searchRes = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
      );
      const searchData = await searchRes.json();
      if (!searchData.teams || searchData.teams.length === 0) return null;

      const idTeam = searchData.teams[0].idTeam;

      // 2) last events => filter for "homeTeam === teamName"
      const lastRes = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${idTeam}`
      );
      const lastData = await lastRes.json();
      let lastHome = [];
      if (lastData.results) {
        lastHome = lastData.results.filter((e) => e.strHomeTeam === teamName).slice(0, 5);
      }
      const { wCount, dCount, lCount } = computeWDL(teamName, lastHome);
      const last5Summary = colorCodedSummary(wCount, dCount, lCount);

      // 3) next fixture => check next
      const nextRes = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${idTeam}`
      );
      const nextData = await nextRes.json();
      let fixtureDate = null;
      let fixtureOppLogo = null;
      if (nextData.events && nextData.events.length > 0) {
        const fix = nextData.events[0];
        fixtureDate = fix.dateEvent;

        // find opponent
        const oppName = (fix.strHomeTeam === teamName)
          ? fix.strAwayTeam
          : fix.strHomeTeam;

        // match it in our local array
        const oppObj = premierLeagueTeams.find((t) => t.name === oppName);
        fixtureOppLogo = oppObj ? oppObj.logo : null;
      }

      return {
        last5Summary,
        nextDate: fixtureDate,
        nextOpponentLogo: fixtureOppLogo,
      };
    } catch (err) {
      console.error("Error fetching data for", teamName, err);
      return null;
    }
  }

  // On homeTeam change, fetch stats
  useEffect(() => {
    if (!homeTeam) {
      setHomeStats(null);
      return;
    }
    fetchTeamData(homeTeam).then((stats) => setHomeStats(stats));
  }, [homeTeam]);

  // On awayTeam change, fetch stats
  useEffect(() => {
    if (!awayTeam) {
      setAwayStats(null);
      return;
    }
    fetchTeamData(awayTeam).then((stats) => setAwayStats(stats));
  }, [awayTeam]);

  return (
    <div className="mt-8">
      {/* Outer container with a half-and-half layout + big "VS" in center */}
      <div className="relative w-full h-[60vh] md:h-[70vh] max-w-5xl mx-auto bg-gray-200 dark:bg-gray-700 
                      rounded overflow-hidden shadow-lg flex">
        {/* LEFT (Home) */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4">
          <TeamDropdown
            label="Home Team"
            teams={premierLeagueTeams}
            value={homeTeam}
            onChange={setHomeTeam}
          />

          {selectedHome ? (
            <div className="relative group mt-6">
              <img
                src={selectedHome.logo}
                alt={selectedHome.name}
                className="h-24 w-auto object-contain
                           transition-transform duration-300 hover:scale-110"
              />
              {/* Hover tooltip for stats */}
              {homeStats && (
                <div
                  className="absolute top-0 left-full ml-4 bg-white dark:bg-gray-900 
                             text-gray-700 dark:text-gray-200 w-56 p-3 
                             rounded shadow-lg border border-gray-200 
                             dark:border-gray-700 hidden group-hover:block"
                >
                  <div className="font-bold mb-1">Last 5 Home Games:</div>
                  {homeStats.last5Summary || "N/A"}

                  <hr className="my-2 border-gray-200 dark:border-gray-700" />

                  <div className="font-bold mb-1">Next Fixture:</div>
                  {homeStats.nextDate ? (
                    <div className="flex items-center space-x-2">
                      {homeStats.nextOpponentLogo && (
                        <img
                          src={homeStats.nextOpponentLogo}
                          alt="Opponent"
                          className="h-5 w-5 object-contain"
                        />
                      )}
                      <span>{homeStats.nextDate}</span>
                    </div>
                  ) : (
                    <span>No upcoming fixture</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 
                            flex items-center justify-center mt-6">
              ?
            </div>
          )}
        </div>

        {/* RIGHT (Away) */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4">
          <TeamDropdown
            label="Away Team"
            teams={premierLeagueTeams}
            value={awayTeam}
            onChange={setAwayTeam}
          />

          {selectedAway ? (
            <div className="relative group mt-6">
              <img
                src={selectedAway.logo}
                alt={selectedAway.name}
                className="h-24 w-auto object-contain
                           transition-transform duration-300 hover:scale-110"
              />
              {awayStats && (
                <div
                  className="absolute top-0 right-full mr-4 bg-white dark:bg-gray-900 
                             text-gray-700 dark:text-gray-200 w-56 p-3 
                             rounded shadow-lg border border-gray-200 
                             dark:border-gray-700 hidden group-hover:block
                             transform -translate-x-full"
                >
                  <div className="font-bold mb-1">Last 5 Home Games:</div>
                  {awayStats.last5Summary || "N/A"}

                  <hr className="my-2 border-gray-200 dark:border-gray-700" />

                  <div className="font-bold mb-1">Next Fixture:</div>
                  {awayStats.nextDate ? (
                    <div className="flex items-center space-x-2">
                      {awayStats.nextOpponentLogo && (
                        <img
                          src={awayStats.nextOpponentLogo}
                          alt="Opponent"
                          className="h-5 w-5 object-contain"
                        />
                      )}
                      <span>{awayStats.nextDate}</span>
                    </div>
                  ) : (
                    <span>No upcoming fixture</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 
                            flex items-center justify-center mt-6">
              ?
            </div>
          )}
        </div>

        {/* "VS" in the center */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     text-5xl font-extrabold text-gray-700 dark:text-gray-200 
                     pointer-events-none animate-pulse"
        >
          VS
        </div>
      </div>
    </div>
  );
}
