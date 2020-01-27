import React from "react";

export function Footer() {
  return (
    <footer className="card-footer">
      <a
        className="card-link card-footer-cta"
        href="https://github.com/neurosity/notion-ocean"
        target="_blank"
        rel="noopener noreferrer"
      >
        View source code
      </a>
      <div className="card-footer-credits">
        Ocean Wave Simulation by{" "}
        <a
          className="card-link"
          href="https://david.li/"
          target="_blank"
          rel="noopener noreferrer"
        >
          David Li
        </a>
      </div>
    </footer>
  );
}
