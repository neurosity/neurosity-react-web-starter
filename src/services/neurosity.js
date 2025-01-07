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
  devices: [],
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

  const getDeviceList = useCallback(() => {
    return neurosity.getDevices().then((devices) => {
      setState((state) => ({ ...state, devices }));
      return devices;
    });
  }, []);

  useEffect(() => {
    if (user && !selectedDevice) {
      getDeviceList()
        .then((devices) => {
          if (devices && devices.length > 0) {
            let deviceToSelect = null;

            if (lastSelectedDeviceId) {
              deviceToSelect = devices.find(
                (device) => device.deviceId === lastSelectedDeviceId
              );
            }

            if (!deviceToSelect) {
              deviceToSelect = devices[0];
              setLastSelectedDeviceId(deviceToSelect.deviceId);
            }

            neurosity.selectDevice(() => deviceToSelect);
          }
        })
        .catch((error) => {
          console.error("[Auto-Select] Error getting devices:", error);
        });
    }
  }, [
    user,
    lastSelectedDeviceId,
    selectedDevice,
    setLastSelectedDeviceId,
    getDeviceList,
  ]);

  useEffect(() => {
    if (!selectedDevice?.deviceId) {
      return;
    }

    const statusSub = neurosity.status().subscribe((status) => {
      if (JSON.stringify(status) !== JSON.stringify(state.status)) {
        setState((state) => ({ ...state, status }));
      }
    });

    return () => {
      statusSub.unsubscribe();
    };
  }, [selectedDevice?.deviceId, state.status]);

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
      if (selectedDevice?.deviceId !== state.selectedDevice?.deviceId) {
        setSelectedDevice(selectedDevice);

        if (selectedDevice?.deviceId !== lastSelectedDeviceId) {
          setLastSelectedDeviceId(selectedDevice?.deviceId);
        }
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [
    setSelectedDevice,
    setLastSelectedDeviceId,
    state.selectedDevice?.deviceId,
    lastSelectedDeviceId,
  ]);

  const logoutNeurosity = useCallback(() => {
    return new Promise((resolve) => {
      neurosity.logout().then(() => {
        setLastSelectedDeviceId(null);
        setState({ ...initialState, loadingUser: false });
        resolve();
      });
    });
  }, [setLastSelectedDeviceId]);

  return {
    ...state,
    lastSelectedDeviceId,
    setLastSelectedDeviceId,
    logoutNeurosity,
    setSelectedDevice,
    getDeviceList,
  };
}
