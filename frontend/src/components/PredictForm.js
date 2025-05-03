import React, { useState } from "react";

const initialForm = {
  month: "",
  weekday: "",
  year: "",
  last_5_home_wins: "",
  last_5_away_wins: "",
  is_weekend: "",
  is_first_half_season: "",
};

export default function PredictForm({ homeTeam, awayTeam, resetTeams }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDateChange = (e) => {
    const dateStr = e.target.value; // "YYYY-MM-DD"
    if (!dateStr) return;

    const [yr, mo, da] = dateStr.split("-").map(Number);
    const dt = new Date(yr, mo - 1, da);

    // getDay() *always* returns 0=Sun…6=Sat
    const raw = dt.getDay();
    // explicit mapping (identity) to “force” the correct number
    const weekday = [0, 1, 2, 3, 4, 5, 6][raw];

    // month 1–12, year as-is
    const month = mo;
    const year = yr;

    // weekend = Sunday (0) or Saturday (6)
    const isWeekend = weekday === 0 || weekday === 6 ? "1" : "0";

    // first‐half of Premier League season:
    // Aug(8)–Jan(1) => yes, Feb–Jul => no
    const isFirstHalf =
      month >= 8 || month <= 1
        ? "1"
        : "0";

    setForm((f) => ({
      ...f,
      month: month.toString(),
      weekday: weekday.toString(),
      year: year.toString(),
      is_weekend: isWeekend,
      is_first_half_season: isFirstHalf,
    }));
  };

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onReset = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
    resetTeams();
  };

  const onPredict = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    const payload = {
      home_team: homeTeam,
      away_team: awayTeam,
      month: +form.month,
      weekday: +form.weekday,
      year: +form.year,
      last_5_home_wins: +form.last_5_home_wins,
      last_5_away_wins: +form.last_5_away_wins,
      is_weekend: +form.is_weekend,
      is_first_half_season: +form.is_first_half_season,
    };
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const allFilled =
    homeTeam &&
    awayTeam &&
    Object.values(form).every((v) => v !== "");

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow flex flex-col">
      {/* header + reset */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Predict Match Outcome
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-primary hover:text-secondary transition"
        >
          Reset All
        </button>
      </div>

      {/* teams */}
      <div className="mb-6 text-gray-700 dark:text-gray-200 space-y-1">
        <p><strong>Home:</strong> {homeTeam || "—"}</p>
        <p><strong>Away:</strong> {awayTeam || "—"}</p>
      </div>

      {/* date picker */}
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-200 mb-1">
          Match Date
        </label>
        <input
          type="date"
          onChange={onDateChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* inputs */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "month", label: "Month (1–12)" },
          { name: "weekday", label: "Weekday (0=Sunday…6=Saturday)" },
          { name: "year", label: "Year (e.g. 2025)" },
          { name: "last_5_home_wins", label: "Last 5 Home Wins" },
          { name: "last_5_away_wins", label: "Last 5 Away Wins" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              {label}
            </label>
            <input
              type="number"
              name={name}
              value={form[name]}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        ))}

        {/* dropdowns */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Is Weekend?
          </label>
          <select
            name="is_weekend"
            value={form.is_weekend}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">-- Select --</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            First Half of Season?
          </label>
          <select
            name="is_first_half_season"
            value={form.is_first_half_season}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">-- Select --</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>

      {/* predict button */}
      <button
        onClick={onPredict}
        disabled={!allFilled || loading}
        className="w-full mt-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Predicting…" : "Predict"}
      </button>

      {/* error */}
      {error && <p className="mt-4 text-red-500 font-medium">Error: {error}</p>}

      {/* result */}
      {result && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Prediction: {result.prediction}
          </h3>
          <ul className="mt-2 space-y-1">
            {Object.entries(result.probabilities).map(([k, v]) => (
              <li
                key={k}
                className="flex justify-between text-gray-800 dark:text-gray-100"
              >
                <span>{k}</span>
                <span>{(v * 100).toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
