import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";

import { neurosity, useNeurosity } from "../services/neurosity";
import { Nav } from "../components/Nav";

function CalmCube({ calmScore }) {
  return (
    <Box args={[1.5, 1.5, 1.5]}>
      <meshStandardMaterial
        color={`hsl(${calmScore * 2}, 70%, 50%)`}
        roughness={1 - calmScore / 100}
        metalness={calmScore / 100}
      />
    </Box>
  );
}

function Scene({ calmScore }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CalmCube calmScore={calmScore} />
      <OrbitControls enableZoom={false} />
    </>
  );
}

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
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 2 }}>
        {user ? <Nav /> : null}
      </div>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <Scene calmScore={calm} />
          </Suspense>
        </Canvas>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: 'white',
          fontSize: '1rem',
          textAlign: 'right',
          zIndex: 1
        }}>
          <div className="calm-score">
            {calm}% <div className="calm-word">Calm</div>
          </div>
        </div>
      </div>
    </main>
  );
}
