import React from "react";
import { Router, navigate } from "@reach/router";

import { Login } from "./components/Login/Login";
import { Confetti } from "./components/Confetti/Confetti";

function App() {
  function onLogin(loginData) {
    navigate("/confetti", {
      state: loginData
    });
  }

  return (
    <Router>
      <Login path="/" onLogin={onLogin} />
      <Confetti path="/confetti" />
    </Router>
  );
}

export default App;
