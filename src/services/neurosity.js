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
      neurosity.selectDevice((devices) =>
        lastSelectedDeviceId
          ? devices.find((device) => device.deviceId === lastSelectedDeviceId)
          : devices[0]
      );
    }
  }, [user, lastSelectedDeviceId, selectedDevice]);

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }

    const subscription = neurosity.status().subscribe((status) => {
      setState((state) => ({ ...state, status }));
    });

    return () => {
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
      setSelectedDevice(selectedDevice);
      setLastSelectedDeviceId(selectedDevice.deviceId); // cache locally
    });

    return () => {
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
