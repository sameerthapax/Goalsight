import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Schedule from "./routes/Schedule";
import PredictForm from "./components/PredictForm";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col`}>
      <BrowserRouter>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/predict" element={<PredictForm/>} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
