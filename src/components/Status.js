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
        <h3 className="status-device-nickname">
          <span
            className="status-indicator"
            style={{ background: getStatusColor(state) }}
          ></span>
          {info.deviceNickname}
        </h3>
      ) : null}
      <div className="status-item status-state">
        <span className="status-state">
          {state in statesLabels ? statesLabels[state] : state}
        </span>
      </div>
      <div className="status-item status-battery">
        {!charging ? <>&#x26A1; Charging</> : <>Charged</>} {battery}%
      </div>
      {sleepMode && state !== "offline" ? (
        <div className="status-item status-sleep-mode">
          &#127769; &nbsp; Sleep mode
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
