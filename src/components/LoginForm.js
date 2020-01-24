import React, { useState } from "react";

export function LoginForm({ onLogin, loading, error }) {
  const [deviceId, setDeviceId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    onLogin({ deviceId, email, password });
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <h2>Login</h2>
      {!!error ? <h4>{error}</h4> : null}
      <div className="row">
        <label htmlFor="deviceId">Enter your device id:</label>
        <input
          type="text"
          min="32"
          max="32"
          id="deviceId"
          name="deviceId"
          value={deviceId}
          disabled={loading}
          onChange={e => setDeviceId(e.target.value)}
        />
      </div>
      <div className="row">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          disabled={loading}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="row">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          disabled={loading}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="row">
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
