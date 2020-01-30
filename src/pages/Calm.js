import React, { useState, useEffect } from "react";
import { Nav } from "../components/Nav";

export function Calm({ user, notion }) {
  const [calm, setCalm] = useState(0);

  useEffect(() => {
    if (!user || !notion) {
      return;
    }

    const subscription = notion.calm().subscribe(calm => {
      setCalm(Number(calm.probability.toFixed(2)));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, notion]);

  return (
    <main className="main-container">
      {user ? <Nav notion={notion} /> : null}
      <div className="calm-score">
        &nbsp;{calm * 100}% <div className="calm-word">Calm</div>
      </div>
    </main>
  );
}
