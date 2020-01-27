import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";

import { Status } from "./Status";
import { Footer } from "./Footer";

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
    <nav className="card">
      <Status notion={notion} info={info} />
      <button onClick={goToLogout} className="card-btn">
        Logout
      </button>
      <Footer />
    </nav>
  );
}
