import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
} from "@react-three/drei";
import { TextureLoader } from "three";
import CanvasLoader from "../Loader";
import * as THREE from "three";

const BallMesh = ({ imgUrl, position = [0, 0, 0] }) => {
  // Always call useLoader - it will handle null safely
  let decal = null;
  
  // Ensure imgUrl is a valid string
  const validUrl = useMemo(() => {
    if (typeof imgUrl === "string" && imgUrl.length > 0) {
      return imgUrl;
    }
    if (imgUrl?.src) return imgUrl.src;
    if (imgUrl?.default) return imgUrl.default;
    return null;
  }, [imgUrl]);

  try {
    if (validUrl) {
      decal = useLoader(TextureLoader, validUrl);
      if (decal) {
        decal.colorSpace = THREE.SRGBColorSpace;
      }
    }
  } catch (error) {
    console.warn(`Failed to load texture: ${validUrl}`, error);
  }

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />

      <mesh position={position} castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />

        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />

        {decal && (
          <Decal
            position={[0, 0, 1]}
            rotation={[0, 0, 0]}
            scale={1}
            map={decal}
            flatShading
          />
        )}
      </mesh>
    </Float>
  );
};

const Ball = ({ imgUrl, position = [0, 0, 0] }) => {
  return <BallMesh imgUrl={imgUrl} position={position} />;
};

export { Ball };

const BallCanvas = ({ icon }) => {
  const canvasRef = useRef(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = () => {
      setContextLost(true);
    };

    const handleContextRestored = () => {
      setContextLost(false);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      
      // Properly dispose of WebGL context on unmount
      const gl = canvas?.getContext?.("webgl2") || canvas?.getContext?.("webgl");
      if (gl) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, []);

  if (contextLost) {
    return <div className="w-full h-full bg-gray-700 rounded-full" />;
  }

  return (
    <Canvas
      ref={canvasRef}
      className="w-full h-full"
      frameloop="auto"
      dpr={[1, 1.2]}
      gl={{
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
        antialias: true,
        alpha: true,
        failIfMajorPerformanceCaveat: true,
      }}
      onCreated={(state) => {
        state.gl.info.autoReset = true;
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
