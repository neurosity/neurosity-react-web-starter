import React from "react";
import { navigate } from "@reach/router";

export function Nav({ user }) {
  function goToLogout() {
    navigate("/logout");
  }

  return (
    <nav>
      {user ? (
        <div>
          <h4>Welcome {user.email}</h4>
          <button onClick={goToLogout}>Logout</button>
        </div>
      ) : null}
    </nav>
  );
}
