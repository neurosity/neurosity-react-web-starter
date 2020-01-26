import React, { useState, useEffect } from "react";
import { Router, navigate } from "@reach/router";
import { Notion } from "@neurosity/notion";
import useLocalStorage from "react-use/lib/useLocalStorage";

import { Loading } from "./components/Loading";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Calm } from "./pages/Calm";

export function App() {
  const [notion, setNotion] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useLocalStorage("deviceId");

  useEffect(() => {
    if (user) {
      navigate("/calm");
    }
  }, [user]);

  useEffect(() => {
    if (deviceId) {
      const notion = new Notion({ deviceId });
      setNotion(notion);
    } else {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    if (!notion) {
      return;
    }

    const subscription = notion.onAuthStateChanged().subscribe(user => {
      if (user) {
        setUser(user);
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [notion]);

  function resetState() {
    setNotion(null);
    setUser(null);
    setDeviceId("");
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Login
        path="/"
        notion={notion}
        user={user}
        setUser={setUser}
        setDeviceId={setDeviceId}
      />
      <Calm path="/calm" notion={notion} user={user} />
      <Logout path="/logout" notion={notion} resetState={resetState} />
    </Router>
  );
}
