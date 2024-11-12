import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { Footer } from "../components/Footer";
import { neurosity, useNeurosity } from "../services/neurosity";

export function Login() {
  const navigate = useNavigate();
  const { user, lastSelectedDeviceId } = useNeurosity();
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  async function handleLogin({ email, password }) {
    if (!email || !password) {
      setError("Please fill the form");
      return;
    }

    setError("");
    setIsLoggingIn(true);

    try {
      const auth = await neurosity.login({ email, password });
      if (auth) {
        navigate(lastSelectedDeviceId ? "/" : "/devices");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="main-container">
      <LoginForm
        onLogin={handleLogin}
        error={error}
        loading={isLoggingIn}
        footerComponent={<Footer />}
      />
    </main>
  );
}
