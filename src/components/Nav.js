import React from "react";
import { useNavigate } from "react-router-dom";

import { Status } from "./Status";
import { Footer } from "./Footer";

export function Nav() {
  const navigate = useNavigate();

  function goToLogout() {
    navigate("/logout");
  }

  return (
    <nav className="card">
      <Status />
      <button onClick={goToLogout} className="card-btn">
        Logout
      </button>
      <Footer />
    </nav>
  );
}
