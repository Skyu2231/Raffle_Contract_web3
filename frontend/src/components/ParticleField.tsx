import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  accent: boolean;
};

type ParticleFieldProps = {
  className?: string;
  /** Roughly how many particles per 1,000,000 px² of canvas. */
  density?: number;
};

/**
 * A canvas flow field: a few hundred particles drift along a smooth vector
 * field, leaving short trails, and shove away from the pointer. Pure 2D
 * canvas, no dependencies, DPR-capped and paused when the tab is hidden.
 */
export function ParticleField({ className = "", density = 150 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    let dark = document.documentElement.classList.contains("dark");

    const pointer = { x: -9999, y: -9999, active: false };

    const observer = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const spawn = (): Particle => {
      const maxLife = 220 + Math.random() * 420;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        life: Math.random() * maxLife,
        maxLife,
        accent: Math.random() < 0.55,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(180, Math.min(950, Math.round((width * height * density) / 1_000_000)));
      particles = Array.from({ length: count }, spawn);
      ctx.clearRect(0, 0, width, height);
    };

    const draw = (dt: number) => {
      elapsed += dt;

      // fade the previous frame so particles leave short trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      const t = elapsed * 0.001;
      for (const p of particles) {
        const flow =
          Math.sin(p.x * 0.0021 + t * 0.32) * Math.cos(p.y * 0.0026 - t * 0.21) * Math.PI * 1.7;

        p.vx += Math.cos(flow) * 0.09;
        p.vy += Math.sin(flow) * 0.09;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 24000 && dist2 > 0.01) {
            const force = (1 - dist2 / 24000) * 1.6;
            const dist = Math.sqrt(dist2);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.965;
        p.vy *= 0.965;
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 3.4) {
          p.vx = (p.vx / speed) * 3.4;
          p.vy = (p.vy / speed) * 3.4;
        }

        const prevX = p.x;
        const prevY = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        if (p.life > p.maxLife || p.x < -40 || p.x > width + 40 || p.y < -40 || p.y > height + 40) {
          Object.assign(p, spawn());
          continue;
        }

        const fade = Math.sin((p.life / p.maxLife) * Math.PI);
        const alpha = fade * (p.accent ? 0.52 : 0.24);
        ctx.strokeStyle = p.accent
          ? `rgba(255, 77, 0, ${alpha})`
          : dark
            ? `rgba(244, 241, 234, ${alpha})`
            : `rgba(17, 17, 16, ${alpha})`;
        ctx.lineWidth = p.accent ? 1.15 : 0.8;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      draw(dt);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || reduced) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    if (reduced) {
      for (let i = 0; i < 3; i += 1) draw(16);
    } else {
      start();
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced) draw(16);
    });
    resizeObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
