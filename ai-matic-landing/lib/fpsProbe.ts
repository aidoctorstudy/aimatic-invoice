/** Measures real requestAnimationFrame cadence for a short burst and reports an approximate
 * fps. Self-adapting: a slow device takes longer to accumulate the sample frames, so the probe
 * naturally runs longer on exactly the devices worth probing, while staying well under 2s on
 * any device that isn't already struggling. No GPU work — just JS/event-loop timing, so it
 * also reflects general device/background-tab contention, not only raw graphics throughput. */
export function probeFps(onResult: (fps: number) => void, sampleFrames = 20): void {
  if (typeof requestAnimationFrame === "undefined") {
    onResult(60);
    return;
  }

  const deltas: number[] = [];
  let last = performance.now();

  function tick(now: number) {
    deltas.push(now - last);
    last = now;
    if (deltas.length < sampleFrames) {
      requestAnimationFrame(tick);
      return;
    }
    // Drop the first sample — it often includes layout/setup jank unrelated to steady-state fps.
    const usable = deltas.slice(1);
    const avgDelta = usable.reduce((sum, v) => sum + v, 0) / usable.length;
    onResult(avgDelta > 0 ? 1000 / avgDelta : 60);
  }

  requestAnimationFrame(tick);
}
