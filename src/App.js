import React from "react";
import { Login } from "./components/Login/Login";

function App() {
  function onLogin(loginData) {
    console.log(loginData);
  }

  return (
    <div className="App">
      <Login onLogin={onLogin} />
    </div>
  );
}

export default App;
