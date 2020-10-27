import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";

import { notion, useNotion } from "../services/notion";
import { Nav } from "../components/Nav";

export function Calm() {
  const { user } = useNotion();
  const [calm, setCalm] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = notion.calm().subscribe((calm) => {
      const calmScore = Math.trunc(calm.probability * 100);
      setCalm(calmScore);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <main className="main-container">
      {user ? <Nav /> : null}
      <div className="calm-score">
        &nbsp;{calm}% <div className="calm-word">Calm</div>
      </div>
    </main>
  );
}
