"use client";

import { Canvas } from "@react-three/fiber";
import { UniverseParticles } from "@/components/three/UniverseParticles";
import { useTabVisible } from "@/lib/useTabVisible";

type Props = {
  chapterCount: number;
  reducedMotion: boolean;
};

export function ParticleUniverseCanvas({ chapterCount, reducedMotion }: Props) {
  const tabVisible = useTabVisible();

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 13], fov: 45, near: 0.1, far: 200 }}
        frameloop={tabVisible ? "always" : "never"}
      >
        <UniverseParticles chapterCount={chapterCount} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
