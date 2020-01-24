import { useEffect } from "react";
import { navigate } from "@reach/router";

export function Logout({ notion, resetState }) {
  useEffect(() => {
    if (notion) {
      notion.logout().then(() => {
        resetState();
        navigate("/");
      });
    }
  }, [notion, resetState]);

  return null;
}
