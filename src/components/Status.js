import React, { useState, useEffect } from "react";

const statesLabels = {
  booting: "Starting OS...",
  shuttingOff: "Shutting off...",
  updating: "Updating OS...",
  online: "Online",
  offline: "Offline"
};

const stateColors = {
  booting: "darkslategrey",
  shuttingOff: "darkslategrey",
  updating: "orange",
  online: "limegreen",
  offline: "crimson"
};

export function Status({ notion, info }) {
  const [status, setStatus] = useState(null);
  const { state, charging, battery, sleepMode } = status || {};

  useEffect(() => {
    if (!notion) {
      return;
    }

    const subscription = notion.status().subscribe(status => {
      setStatus(status);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [notion]);

  if (!status) {
    return <div>Connecting to device...</div>;
  }

  return (
    <aside>
      {info ? (
        <h3 className="card-heading">{info.deviceNickname}</h3>
      ) : null}
      <div className="status-item status-state">
        <span
          className="status-indicator"
          style={{ background: getStatusColor(state) }}
        ></span>
        {state in statesLabels ? statesLabels[state] : state}
      </div>
      {state !== "offline" ? (
        <div className="status-item status-battery">
          <ChargingIcon /> &nbsp;{charging ? "Charging" : "Charged"}
          &nbsp;{battery}%
        </div>
      ) : null}
      {sleepMode && state !== "offline" ? (
        <div className="status-item status-sleep-mode">
          <SleepModeIcon /> &nbsp;Sleep mode
        </div>
      ) : null}
    </aside>
  );
}

function getStatusColor(state) {
  if (state in stateColors) {
    return stateColors[state];
  }

  return stateColors.offline;
}

function ChargingIcon() {
  return (
    <span role="img" aria-label="Electricity">
      &#x26A1;
    </span>
  );
}

function SleepModeIcon() {
  return (
    <span role="img" aria-label="The Moon">
      &#127769;
    </span>
  );
}
