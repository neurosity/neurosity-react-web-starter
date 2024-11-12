import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";

export function Footer() {
  const [darkMode, setDarkMode] = useDarkMode();

  const handleThemeToggle = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    setDarkMode(!darkMode);
  };

  return (
    <footer className="card-footer">
      <a
        className="card-link card-footer-cta"
        href="https://github.com/neurosity/notion-react-starter"
        target="_blank"
        rel="noopener noreferrer"
      >
        View source code
      </a>
      <div className="card-footer-credits">
        Built by{" "}
        <a
          className="card-link"
          href="https://neurosity.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          Neurosity
        </a>
      </div>
      <button
        type="button" // Explicitly set button type to prevent form submission
        className="theme-toggle"
        onClick={handleThemeToggle}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
    </footer>
  );
}
