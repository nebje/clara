import React, { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";

async function getIntervention(score) {
  try {
    const res = await fetch("https://micromirror-backend.fly.dev/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score })
    });
    const data = await res.json();
    alert("Intervención: " + data.intervention);
  } catch (e) {
    console.error("Error llamando al backend:", e);
  }
}

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      upperBodyOnly: true,
      smoothLandmarks: true
    });

    pose.onResults((results) => {
      const lm = results.poseLandmarks;
      if (!lm) return;
      const vis =
        lm.reduce((acc, p) => acc + (p.visibility || 0), 0) / lm.length;
      const score = Math.max(0, Math.min(1, vis));
      getIntervention(score);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });
    camera.start();
  }, []);

  return (
    <div>
      <h1>MicroMirror MVP</h1>
      <p>La cámara está funcionando en segundo plano.</p>
      <video ref={videoRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;
