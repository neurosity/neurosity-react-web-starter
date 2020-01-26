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
        className="nav-link"
        href="https://github.com/neurosity/demo-notion-confetti"
        target="_blank"
        noopener
        noreferrer
      >
        View source code
      </a>
    </nav>
  );
}
