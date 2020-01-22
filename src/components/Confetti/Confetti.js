import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import { Notion } from "@neurosity/notion";

export function Confetti({ location }) {
  const [notion, setNotion] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const { deviceId, email, password } = location.state || {};

  useEffect(() => {
    if (deviceId) {
      setNotion(new Notion({ deviceId }));
    }
  }, [deviceId]);

  useEffect(() => {
    if (!email || !password) {
      navigate("/");
      return;
    }
  }, [email, password]);

  useEffect(() => {
    if (notion) {
      notion.onAuthStateChanged().subscribe(user => {
        if (user) {
          setUser(user);
        } else {
          login();
        }
      });
    }
  }, [notion]);

  async function login() {
    const response = await notion
      .login({ email, password })
      .catch(error => {
        setError(error.message);
      });

    if (response) {
      setError("");
      setUser(response.user);
    }
  }

  function logout() {
    setUser(null);
    notion.logout();
    navigate("/");
  }

  return (
    <main>
      <h1>Confetti!</h1>
      {!!error ? <h4>{error}</h4> : null}
      {user ? (
        <div>
          <h4>Welcome {user.email}</h4>
          <button onClick={logout}>Logout</button>
        </div>
      ) : null}
      <p>Your device id is {deviceId}</p>
    </main>
  );
}
