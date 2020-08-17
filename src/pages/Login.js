import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import useEffectOnce from "react-use/lib/useEffectOnce";

import { LoginForm } from "../components/LoginForm";
import { Footer } from "../components/Footer";

import { notion, useNotion } from "../services/notion";

export function Login() {
  const { user, lastSelectedDeviceId, setSelectedDevice } = useNotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffectOnce(() => {
    if (user) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (email && password) {
      login();
    }

    async function login() {
      setIsLoggingIn(true);
      const auth = await notion
        .login({ email, password })
        .catch((error) => {
          setError(error.message);
        });

      if (auth) {
        resetForm();

        if (lastSelectedDeviceId) {
          navigate("/");
        } else {
          navigate("/devices");
        }
      }
      setIsLoggingIn(false);
    }
  }, [
    email,
    password,
    setError,
    lastSelectedDeviceId,
    setSelectedDevice
  ]);

  function onLogin({ email, password }) {
    if (email && password) {
      setError("");
      setEmail(email);
      setPassword(password);
    } else {
      setError("Please fill the form");
    }
  }

  function resetForm() {
    setError("");
    setEmail("");
    setPassword("");
  }

  return (
    <main className="main-container">
      <LoginForm
        onLogin={onLogin}
        error={error}
        loading={isLoggingIn}
        footerComponent={<Footer />}
      />
    </main>
  );
}
