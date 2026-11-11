/** Static, zero-WebGL particle silhouette shown when the device can't run the 3D scene. */
export function SceneFallback() {
  const dots = [
    { x: 50, y: 30, s: 10 },
    { x: 38, y: 42, s: 7 },
    { x: 62, y: 44, s: 8 },
    { x: 45, y: 55, s: 6 },
    { x: 58, y: 58, s: 9 },
    { x: 30, y: 60, s: 5 },
    { x: 70, y: 62, s: 6 },
    { x: 50, y: 68, s: 7 },
    { x: 40, y: 75, s: 5 },
    { x: 60, y: 76, s: 5 },
  ];

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-sm"
      role="img"
      aria-label="Illustration of a particle network"
    >
      {dots.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full brand-gradient opacity-70"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.s}%`,
            height: `${dot.s}%`,
            transform: "translate(-50%, -50%)",
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
}
