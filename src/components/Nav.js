import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";

import { Status } from "./Status";

export function Nav({ notion }) {
  const [info, setInfo] = useState(null);

  function goToLogout() {
    navigate("/logout");
  }

  useEffect(() => {
    if (!notion) {
      return;
    }

    notion.getInfo().then(info => {
      setInfo(info);
    });
  }, [notion]);

  return (
    <nav className="nav">
      <Status notion={notion} info={info} />
      <button onClick={goToLogout} className="nav-btn">
        Logout
      </button>
      <a
        className="nav-link nav-link-block"
        href="https://github.com/neurosity/notion-ocean"
        target="_blank"
        rel="noopener noreferrer"
      >
        View source code
      </a>
      <footer className="nav-footer">
        Ocean Wave Simulation by{" "}
        <a
          className="nav-link"
          href="https://david.li/"
          target="_blank"
          rel="noopener noreferrer"
        >
          David Li
        </a>
      </footer>
    </nav>
  );
}
