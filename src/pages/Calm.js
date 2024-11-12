import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { neurosity, useNeurosity } from "../services/neurosity";
import { Nav } from "../components/Nav";

export function Calm() {
  const navigate = useNavigate();
  const { user } = useNeurosity();
  const [calm, setCalm] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = neurosity.calm().subscribe((calm) => {
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
