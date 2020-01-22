import React, { useEffect } from "react";
import { navigate } from "@reach/router";

export function Confetti({ location }) {
  const { deviceId, email, password } = location.state;

  useEffect(() => {
    if (!deviceId || !email || !password) {
      navigate("/");
    }
  }, [deviceId, email, password]);

  return (
    <main>
      <h1>Confetti!</h1>
      <p>Your device id is {deviceId}</p>
    </main>
  );
}
