import React from "react";

export function Footer() {
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
    </footer>
  );
}
