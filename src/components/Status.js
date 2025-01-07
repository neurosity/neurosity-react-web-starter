import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useNeurosity } from "../services/neurosity";

const statesLabels = {
  booting: "Starting OS...",
  shuttingOff: "Shutting off...",
  updating: "Updating OS...",
  online: "Online",
  offline: "Offline",
};

const stateColors = {
  booting: "darkslategrey",
  shuttingOff: "darkslategrey",
  updating: "orange",
  online: "limegreen",
  offline: "crimson",
};

export function Status() {
  const { status, selectedDevice, devices, getDeviceList } = useNeurosity();
  const { state, charging, battery, sleepMode } = status || {};

  useEffect(() => {
    getDeviceList();
  }, [getDeviceList]);

  if (!status) {
    return <div>Connecting to device...</div>;
  }

  const hasMultipleDevices = devices && devices.length > 1;

  return (
    <aside>
      {selectedDevice ? (
        <h3 className="card-heading status-heading">
          <span>
            <span role="img" aria-label="My Device">
              ⚙️
            </span>
            &nbsp;&nbsp;
            {selectedDevice.deviceNickname}
          </span>
          {hasMultipleDevices && (
            <Link
              to="/devices"
              className="card-link"
              style={{ fontSize: "0.8em" }}
            >
              Devices
            </Link>
          )}
        </h3>
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
