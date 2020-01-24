import React, { useState, useEffect } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { Nav } from "../components/Nav";

export function Calm({ user, notion }) {
  const [calmScore, setCalmScore] = useState();
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!user || !notion) {
      return;
    }

    const subscription = notion.calm().subscribe(calm => {
      const score = Number(calm.probability.toFixed(2));
      setCalmScore(score);
      if (score > 0.5) {
        setShowConfetti(true);
      } else {
        setShowConfetti(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, notion]);

  return (
    <main>
      <Nav user={user} notion={notion} />
      <h1>Confetti!</h1>
      <h2>Calm score: {calmScore}</h2>
      {showConfetti ? <Confetti width={width} height={height} /> : null}
    </main>
  );
}
