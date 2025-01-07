import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { neurosity, useNeurosity } from "../services/neurosity";

export function Devices() {
  const navigate = useNavigate();
  const { user, lastSelectedDeviceId } = useNeurosity();
  const [devices, setDevices] = useState([]);
  const [draftDeviceId, setDraftDeviceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || submitting) {
      console.log("[Devices Page] Skipping device load:", {
        user: !!user,
        submitting,
      });
      return;
    }

    setLoading(true);
    console.log("[Devices Page] Loading devices for user:", user.email);

    neurosity
      .getDevices()
      .then((devices) => {
        console.log("[Devices Page] Loaded devices:", devices);
        setDevices(devices);

        if (devices.length) {
          const deviceId = lastSelectedDeviceId
            ? lastSelectedDeviceId
            : devices[0].deviceId;
          console.log("[Devices Page] Setting draft device ID:", deviceId);
          setDraftDeviceId(deviceId);
        } else {
          console.warn("[Devices Page] No devices available");
        }
      })
      .catch((error) => {
        console.error("[Devices Page] Error loading devices:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, lastSelectedDeviceId, submitting]);

  function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    console.log("[Devices Page] Submitting device selection:", draftDeviceId);

    const selectedDevice = devices.find(
      (device) => device.deviceId === draftDeviceId
    );
    console.log("[Devices Page] Found device:", selectedDevice);

    if (!selectedDevice) {
      console.error("[Devices Page] Selected device not found in devices list");
      setError("Selected device not found");
      setSubmitting(false);
      return;
    }

    console.log("[Devices Page] Attempting to select device:", selectedDevice);
    neurosity
      .selectDevice(() => {
        console.log(
          "[Devices Page] Returning device in selector:",
          selectedDevice
        );
        return selectedDevice;
      })
      .then(() => {
        console.log(
          "[Devices Page] Device selection successful, navigating home"
        );
        navigate("/");
      })
      .catch((error) => {
        console.error("[Devices Page] Error selecting device:", error);
        setError(error.message);
      });
  }

  return (
    <main className="main-container">
      <form className="card login-form" onSubmit={onSubmit}>
        <h3 className="card-heading">Devices</h3>
        {!!error ? <h4 className="card-error">{error}</h4> : null}
        <div className="row">
          <label>Select a Device</label>
          <select
            name="deviceSelect"
            value={draftDeviceId}
            disabled={loading}
            onChange={(e) => setDraftDeviceId(e.target.value)}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.deviceNickname || device.modelName}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          <button type="submit" className="card-btn" disabled={loading}>
            {loading ? "Loading Devices..." : "Select"}
          </button>
        </div>
      </form>
    </main>
  );
}
