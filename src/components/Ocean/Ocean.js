import React, { useState, useEffect, useRef } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import useRafState from "react-use/lib/useRafState";

import { Simulator, Camera } from "./simulation.js";
import { mapCalmToWeather } from "./weather.js";
import "./ocean.css";

const camera = new Camera();

export function Ocean({ calm }) {
  const ref = useRef();
  const { width, height } = useWindowSize();
  const [simulator, setSimulator] = useState();
  const [lastTime, setLastTime] = useRafState(Date.now());

  useEffect(() => {
    const simulator = new Simulator(ref.current, 0, 0);
    setSimulator(simulator);
  }, [ref, setSimulator]);

  useEffect(() => {
    if (simulator && calm) {
      setWeatherBasedOnCalm(calm);
    }

    function setWeatherBasedOnCalm(calm) {
      const { choppiness, wind, size } = mapCalmToWeather(calm);
      simulator.setChoppiness(choppiness);
      simulator.setWind(wind, wind);
      simulator.setSize(size);
    }
  }, [calm, simulator]);

  useEffect(() => {
    if (simulator) {
      simulator.resize(width, height);
    }
  }, [width, height, simulator]);

  useEffect(() => {
    if (simulator) {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000 || 0.0;
      setLastTime(currentTime);
      simulator.render(deltaTime, camera);
    }
  }, [simulator, lastTime, setLastTime]);

  return <canvas className="simulation" ref={ref}></canvas>;
}
