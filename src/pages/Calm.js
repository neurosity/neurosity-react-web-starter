import React, { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { Ocean } from "../components/Ocean/Ocean";

const testSlider = true;

export function Calm({ user, notion }) {
  const [calm, setCalm] = useState(0);
  console.log("calm", calm);

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
    <main>
      {testSlider ? <TestSlider calm={calm} setCalm={setCalm} /> : null}
      {user ? <Nav notion={notion} /> : null}
      <Ocean calm={calm} setCalm={setCalm} />
    </main>
  );
}

function TestSlider({ calm, setCalm }) {
  const style = { position: "absolute", zIndex: 3, padding: "20px" };
  return (
    <div style={style}>
      <input
        type="range"
        min={0}
        max={1}
        value={calm}
        step={0.01}
        onChange={e => setCalm(Number(e.target.value))}
      />
      <small>&nbsp;{calm}% Calm</small>
    </div>
  );
}
