import React, { useContext, createContext } from "react";
import { useState, useEffect, useCallback } from "react";
import { Neurosity } from "@neurosity/sdk";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const neurosity = new Neurosity({
  autoSelectDevice: false,
});

const initialState = {
  selectedDevice: null,
  status: null,
  user: null,
  loadingUser: true,
};

export const NeurosityContext = createContext();

export const useNeurosity = () => {
  return useContext(NeurosityContext);
};

export function ProvideNeurosity({ children }) {
  const neurosityProvider = useProvideNeurosity();

  return (
    <NeurosityContext.Provider value={neurosityProvider}>
      {children}
    </NeurosityContext.Provider>
  );
}

function useProvideNeurosity() {
  const [lastSelectedDeviceId, setLastSelectedDeviceId] =
    useLocalStorage("deviceId");

  const [state, setState] = useState({
    ...initialState,
  });

  const { user, selectedDevice } = state;

  const setSelectedDevice = useCallback((selectedDevice) => {
    setState((state) => ({
      ...state,
      selectedDevice,
    }));
  }, []);

  useEffect(() => {
    if (user && !selectedDevice) {
      console.log("[Auto-Select] Starting device selection process");
      console.log("[Auto-Select] User:", user?.email);
      console.log(
        "[Auto-Select] Last selected device ID:",
        lastSelectedDeviceId
      );

      neurosity
        .getDevices()
        .then((devices) => {
          console.log("[Auto-Select] Available devices:", devices);

          if (devices && devices.length > 0) {
            let deviceToSelect = null;

            // Try to find the last selected device
            if (lastSelectedDeviceId) {
              deviceToSelect = devices.find(
                (device) => device.deviceId === lastSelectedDeviceId
              );
              console.log("[Auto-Select] Last device found:", !!deviceToSelect);
            }

            // If no last device or not found, use the first available device
            if (!deviceToSelect) {
              deviceToSelect = devices[0];
              console.log(
                "[Auto-Select] Using first available device:",
                deviceToSelect.deviceId
              );
              // Update the lastSelectedDeviceId to match the new selection
              setLastSelectedDeviceId(deviceToSelect.deviceId);
            }

            console.log("[Auto-Select] Device to select:", deviceToSelect);

            neurosity.selectDevice(() => {
              console.log(
                "[Auto-Select] Returning device in selector:",
                deviceToSelect
              );
              return deviceToSelect;
            });
          } else {
            console.warn("[Auto-Select] No devices available");
          }
        })
        .catch((error) => {
          console.error("[Auto-Select] Error getting devices:", error);
        });
    }
  }, [user, lastSelectedDeviceId, selectedDevice, setLastSelectedDeviceId]);

  useEffect(() => {
    if (!selectedDevice) {
      console.log(
        "[Device Status] No device selected, skipping status subscription"
      );
      return;
    }

    console.log(
      "[Device Status] Setting up status subscription for device:",
      selectedDevice.deviceId
    );
    const subscription = neurosity.status().subscribe((status) => {
      console.log("[Device Status] Received status update:", status);
      setState((state) => ({ ...state, status }));
    });

    return () => {
      console.log("[Device Status] Cleaning up status subscription");
      subscription.unsubscribe();
    };
  }, [selectedDevice]);

  useEffect(() => {
    setState((state) => ({ ...state, loadingUser: true }));

    const subscription = neurosity.onAuthStateChanged().subscribe((user) => {
      setState((state) => ({
        ...state,
        user,
        loadingUser: false,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sub = neurosity.onDeviceChange().subscribe((selectedDevice) => {
      console.log("[Device Change] Device changed to:", selectedDevice);
      setSelectedDevice(selectedDevice);
      setLastSelectedDeviceId(selectedDevice.deviceId); // cache locally
    });

    return () => {
      console.log("[Device Change] Cleaning up device change subscription");
      sub.unsubscribe();
    };
  }, [setSelectedDevice, setLastSelectedDeviceId]);

  const logoutNeurosity = useCallback(() => {
    return new Promise((resolve) => {
      neurosity.logout().then(resolve);
      setState({ ...initialState, loadingUser: false });
    });
  }, []);

  return {
    ...state,
    lastSelectedDeviceId,
    setLastSelectedDeviceId,
    logoutNeurosity,
    setSelectedDevice,
  };
}
