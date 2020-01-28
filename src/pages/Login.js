import React, { useState, useEffect } from "react";
import { LoginForm } from "../components/LoginForm";
import { Ocean } from "../components/Ocean/Ocean";
import { Footer } from "../components/Footer";

export function Login({ notion, user, setUser, setDeviceId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!user && notion && email && password) {
      login();
    }

    async function login() {
      setIsLoggingIn(true);
      const auth = await notion
        .login({ email, password })
        .catch(error => {
          setError(error.message);
        });

      if (auth) {
        setUser(auth.user);
        resetForm();
      }
      setIsLoggingIn(false);
    }
  }, [email, password, notion, user, setUser, setError]);

  function onLogin({ email, password, deviceId }) {
    if (deviceId && deviceId.length !== 32) {
      setError("Please enter a valid device id");
      return;
    }

    if (email && password && deviceId) {
      setError("");
      setEmail(email);
      setPassword(password);
      setDeviceId(deviceId);
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
    <>
      <LoginForm onLogin={onLogin} error={error} loading={isLoggingIn}>
        <Footer />
      </LoginForm>
      <Ocean calm={0} />
    </>
  );
}
