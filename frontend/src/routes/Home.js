// src/routes/Home.jsx
import React, { useState, useEffect } from "react";
import TeamDropdown from "../components/TeamDropdown";
import PredictForm from "../components/PredictForm";
import { premierLeagueTeams } from "../data/plTeams.js";

export default function Home() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");

  const [homeStats, setHomeStats] = useState(null);
  const [awayStats, setAwayStats] = useState(null);

  const selectedHome = premierLeagueTeams.find((t) => t.name === homeTeam);
  const selectedAway = premierLeagueTeams.find((t) => t.name === awayTeam);

  // Count W/D/L from last events
  function computeWDL(teamName, events) {
    let w = 0, d = 0, l = 0;
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

  // Color-coded summary
  function colorCodedSummary(w, d, l) {
    return (
      <div className="space-x-1">
        <span className="text-green-600 dark:text-green-400 font-bold">{w}W</span>
        <span>{d}D</span>
        <span className="text-red-600 dark:text-red-400 font-bold">{l}L</span>
      </div>
    );
  }

  // Fetch logic for last 5 home + next fixture
  async function fetchStats(teamName) {
    if (!teamName) return null;
    try {
      // 1) search for team => get ID
      const searchRes = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
      );
      const searchData = await searchRes.json();
      if (!searchData.teams || searchData.teams.length === 0) return null;

      const idTeam = searchData.teams[0].idTeam;

      // 2) last events
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

      // 3) next fixture
      const nextRes = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${idTeam}`
      );
      const nextData = await nextRes.json();
      let fixtureDate = null;
      let fixtureOppLogo = null;
      if (nextData.events && nextData.events.length > 0) {
        const fix = nextData.events[0];
        fixtureDate = fix.dateEvent;

        const oppName = (fix.strHomeTeam === teamName)
          ? fix.strAwayTeam
          : fix.strHomeTeam;
        // find the opponent in our local array
        const oppObj = premierLeagueTeams.find((t) => t.name === oppName);
        fixtureOppLogo = oppObj ? oppObj.logo : null;
      }

      return {
        last5Summary,
        nextDate: fixtureDate,
        nextOpponentLogo: fixtureOppLogo,
      };
    } catch (err) {
      console.error("Error fetching stats for", teamName, err);
      return null;
    }
  }

  // On homeTeam change
  useEffect(() => {
    if (homeTeam) {
      fetchStats(homeTeam).then(setHomeStats);
    } else {
      setHomeStats(null);
    }
  }, [homeTeam]);

  // On awayTeam change
  useEffect(() => {
    if (awayTeam) {
      fetchStats(awayTeam).then(setAwayStats);
    } else {
      setAwayStats(null);
    }
  }, [awayTeam]);

  return (
    <div className="max-w-6xl mx-auto mt-12">
      <div className="flex justify-center mb-6">
        <img
        src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg"
        alt="Premier League"
        className="h-16 opacity-90"
        />
      </div>
      {/* Container with a half-and-half layout + big “VS” in center */}
      <div className="relative w-full h-[70vh] bg-gradient-to-r from-white to-white dark:from-gray-800 dark:to-gray-800 
                      flex overflow-hidden rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Left side: Home */}
        <div className="w-1/2 flex flex-col items-center justify-center px-6 bg-white dark:bg-gray-800">
          {/* DropDown */}
          <div className="mb-6 w-3/4">
            <TeamDropdown
              label="Home Team"
              teams={premierLeagueTeams}
              value={homeTeam}
              onChange={setHomeTeam}
            />
          </div>

          {/* Big logo with stats tooltip */}
          {selectedHome ? (
            <div className="relative group">
              <img
                src={selectedHome.logo}
                alt={selectedHome.name}
                className="h-28 w-auto object-contain transition-transform 
                           duration-300 hover:scale-110"
              />
              {homeStats && (
                <div
                  className="absolute top-1/2 left-full transform -translate-y-1/2 ml-3
                             bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 
                             w-52 p-3 rounded-lg shadow-lg border border-gray-200 
                             dark:border-gray-700 hidden group-hover:block"
                >
                  <div className="font-semibold mb-1">Last 5 Home Games</div>
                  {homeStats.last5Summary || "No data"}
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <div className="font-semibold mb-1">Next Fixture</div>
                  {homeStats.nextDate ? (
                    <div className="flex items-center space-x-2">
                      {homeStats.nextOpponentLogo && (
                        <img
                          src={homeStats.nextOpponentLogo}
                          alt="opp"
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
            <div className="h-28 w-28 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              ?
            </div>
          )}
        </div>

        {/* Right side: Away */}
        <div className="w-1/2 flex flex-col items-center justify-center px-6 bg-white dark:bg-gray-800">
          {/* DropDown */}
          <div className="mb-6 w-3/4">
            <TeamDropdown
              label="Away Team"
              teams={premierLeagueTeams}
              value={awayTeam}
              onChange={setAwayTeam}
            />
          </div>

          {selectedAway ? (
            <div className="relative group">
              <img
                src={selectedAway.logo}
                alt={selectedAway.name}
                className="h-28 w-auto object-contain transition-transform 
                           duration-300 hover:scale-110"
              />
              {awayStats && (
                <div
                  className="absolute top-1/2 right-full transform -translate-y-1/2 mr-3
                             bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200
                             w-52 p-3 rounded-lg shadow-lg border border-gray-200
                             dark:border-gray-700 hidden group-hover:block
                             text-sm"
                >
                  <div className="font-semibold mb-1">Last 5 Home Games</div>
                  {awayStats.last5Summary || "No data"}
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <div className="font-semibold mb-1">Next Fixture</div>
                  {awayStats.nextDate ? (
                    <div className="flex items-center space-x-2">
                      {awayStats.nextOpponentLogo && (
                        <img
                          src={awayStats.nextOpponentLogo}
                          alt="opp"
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
            <div className="h-28 w-28 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              ?
            </div>
          )}
        </div>

        {/* Big “VS” in the center */}
        <div
          className="absolute text-6xl md:text-7xl font-extrabold 
                     text-gray-700 dark:text-gray-200 
                     top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     pointer-events-none animate-pulse"
        >
          VS
        </div>
      </div>
      {/* ← NEW: Prediction form */}
      <PredictForm
        homeTeam={homeTeam}                                  
        awayTeam={awayTeam}                                  
        resetTeams={() => { setHomeTeam(""); setAwayTeam(""); }}
      />
    </div>
  );
}
