import { useEffect } from "react";
import { navigate } from "@reach/router";

import { useNotion } from "../services/notion";

export function Logout() {
  const { logoutNotion } = useNotion();

  useEffect(() => {
    logoutNotion().then(() => {
      navigate("/");
    });
  }, [logoutNotion]);

  return null;
}
