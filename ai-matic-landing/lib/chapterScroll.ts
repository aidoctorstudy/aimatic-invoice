/** Reads the fractional scroll-chapter position from `[data-chapter]` DOM markers. */
export function computeChapterPos(els: HTMLElement[]): number {
  if (els.length < 2) return 0;
  const c = window.scrollY;
  let i = 0;
  for (; i < els.length - 1; i++) {
    if (c < els[i + 1].offsetTop) break;
  }
  if (i >= els.length - 1) return els.length - 1;
  const a = els[i].offsetTop;
  const b = els[i + 1].offsetTop;
  const frac = b > a ? (c - a) / (b - a) : 0;
  return i + Math.min(1, Math.max(0, frac));
}

export function queryChapterEls(chapterCount: number): HTMLElement[] {
  const chapterEls: HTMLElement[] = [];
  for (let i = 0; i < chapterCount; i++) {
    const el = document.querySelector<HTMLElement>(`[data-chapter="${i}"]`);
    if (el) chapterEls[i] = el;
  }
  return chapterEls;
}
