import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";

export function Nav({ user, notion }) {
  const [status, setStatus] = useState(null);
  const [info, setInfo] = useState(null);
  const { state, charging, battery } = status || {};

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

    const subscription = notion.status().subscribe(status => {
      setStatus(status);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [notion]);

  return (
    <nav>
      {user ? (
        <div>
          <h4>{info ? info.deviceNickname : null}</h4>
          {status ? (
            <div>
              <span>{state ? state : "connecting..."}</span>
              <span>
                Battery {battery}% {charging ? "(charging)" : null}
              </span>
            </div>
          ) : (
            <div>Connecting...</div>
          )}
          <button onClick={goToLogout}>Logout</button>
        </div>
      ) : null}
    </nav>
  );
}
