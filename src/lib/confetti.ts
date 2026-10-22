/*
  A one-off confetti burst, like Lighthouse shows for a perfect score. No library:
  a full-viewport canvas is created on demand, animated for a couple of seconds
  with requestAnimationFrame, then removed, so nothing lingers after it's done.
*/
const COLORS = ["#0cce6b", "#3ee089", "#a59cff", "#3fb4ec", "#f0913f", "#e8eef0"];
const DURATION_MS = 2600;

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  wobble: number;
};

export function burst(origin: DOMRect, count = 140) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:60";
  document.body.append(canvas);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const cx = origin.left + origin.width / 2;
  const cy = origin.top + origin.height / 2;
  const pieces: Piece[] = Array.from({ length: count }, () => {
    // Fan upward and outward from the centre of the scores.
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 7 + Math.random() * 9;
    return {
      x: cx + (Math.random() - 0.5) * origin.width * 0.6,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 5 + Math.random() * 5,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      wobble: Math.random() * Math.PI * 2,
    };
  });

  const start = performance.now();
  function frame(now: number) {
    const elapsed = now - start;
    if (elapsed > DURATION_MS) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalAlpha = Math.min(1, (DURATION_MS - elapsed) / 600);
    for (const p of pieces) {
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.32;
      p.wobble += 0.12;
      p.x += p.vx + Math.sin(p.wobble) * 0.6;
      p.y += p.vy;
      p.rotation += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      // Squash the height with the wobble so pieces look like they're flipping.
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, (p.size / 2) * Math.abs(Math.cos(p.wobble)) + 1);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
