import React, { useState } from "react";
import { Neurosity } from "@neurosity/sdk";

export function LoginForm({
  onLogin,
  loading: externalLoading,
  error,
  footerComponent,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);

  const neurosity = new Neurosity({
    autoReconnect: true,
    timesync: true,
    deviceId: process.env.REACT_APP_DEVICE_ID,
  });

  const handleLogin = async (email, password) => {
    try {
      setInternalLoading(true);
      await neurosity.login({
        email,
        password,
      });
      onLogin({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  function onSubmit(event) {
    event.preventDefault();
    handleLogin(email, password);
  }

  const isLoading = externalLoading || internalLoading;

  return (
    <form className="card login-form" onSubmit={onSubmit}>
      <h3 className="card-heading">Login</h3>
      {!!error ? <h4 className="card-error">{error}</h4> : null}
      <div className="row">
        <label>Email</label>
        <input
          type="email"
          value={email}
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="row">
        <label>Password</label>
        <input
          type="password"
          value={password}
          disabled={isLoading}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="row">
        <button type="submit" className="card-btn" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
      {footerComponent}
    </form>
  );
}
