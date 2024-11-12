import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { Footer } from "../components/Footer";
import { neurosity, useNeurosity } from "../services/neurosity";

export function Login() {
  const navigate = useNavigate();
  const { user, lastSelectedDeviceId } = useNeurosity();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (email && password) {
      login();
    }

    async function login() {
      setIsLoggingIn(true);
      const auth = await neurosity.login({ email, password }).catch((error) => {
        setError(error.message);
      });

      if (auth) {
        resetForm();
        navigate(lastSelectedDeviceId ? "/" : "/devices");
      }
      setIsLoggingIn(false);
    }
  }, [email, password, lastSelectedDeviceId, navigate]);

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
