import React, { useState } from "react";
import "./login.css";

export function Login({ onLogin }) {
  const [deviceId, setDeviceId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    onLogin({
      deviceId,
      email,
      password
    });
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <h2>Login</h2>
      <div className="row">
        <label htmlFor="deviceId">Enter your device id:</label>
        <input
          type="text"
          min="32"
          max="32"
          id="deviceId"
          name="deviceId"
          value={deviceId}
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
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="row">
        <button type="submit">Login</button>
      </div>
    </form>
  );
}
