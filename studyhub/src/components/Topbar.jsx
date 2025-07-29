import React, { useEffect, useState } from "react";
import "../index.css";

const Topbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>👋 Welcome back!</h2>
      </div>

      <div className="topbar-right">
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        <div className="profile">
          <img src="/avatar.png" alt="Profile" />
          <span>Student</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
