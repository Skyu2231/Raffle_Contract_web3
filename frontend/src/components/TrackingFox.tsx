import { useEffect, useId, useRef } from "react";

type TrackingFoxProps = {
  className?: string;
  /** Optional title for screen readers; omit for purely decorative use. */
  title?: string;
};

/**
 * The raffle fox mascot. Its pupils and head gently follow the pointer, like a
 * cursor-aware sticker. Tracking is skipped for coarse pointers and when the
 * visitor prefers reduced motion, leaving a still fox.
 */
export function TrackingFox({ className = "", title }: TrackingFoxProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    if (reduceMotion.matches || coarsePointer.matches) return;

    let frame = 0;
    let lastX = 0;
    let lastY = 0;

    const apply = () => {
      frame = 0;
      const box = svg.getBoundingClientRect();
      if (!box.width) return;

      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
      const dx = lastX - centerX;
      const dy = lastY - centerY;
      const distance = Math.hypot(dx, dy) || 1;

      // Pupils slide inside the eye sockets; travel scales with the rendered size.
      const travel = Math.max(1.2, box.width * 0.07);
      const pull = Math.min(1, distance / 140);
      const px = (dx / distance) * travel * pull;
      const py = (dy / distance) * travel * pull;

      if (pupilsRef.current) {
        pupilsRef.current.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
      }

      // The head leans a few degrees toward the pointer, with a tiny nudge.
      const tilt = Math.max(-8, Math.min(8, dx / 42));
      const lean = Math.min(1, distance / 200) * box.width * 0.012;
      const leanX = (dx / distance) * lean;
      const leanY = (dy / distance) * lean;
      if (headRef.current) {
        headRef.current.style.transform = `translate(${leanX.toFixed(2)}px, ${leanY.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const reset = () => {
      if (pupilsRef.current) pupilsRef.current.style.transform = "translate(0px, 0px)";
      if (headRef.current) headRef.current.style.transform = "rotate(0deg)";
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`${gradientId}-fur`} x1="10" y1="4" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff8a4c" />
          <stop offset="0.55" stopColor="#ff5c16" />
          <stop offset="1" stopColor="#e2470a" />
        </linearGradient>
        <clipPath id={`${gradientId}-face`}>
          <path d="M6 5 23 16h18L58 5l-2.2 23.5C54 43 44 54 32 54S10 43 8.2 28.5Z" />
        </clipPath>
      </defs>

      <g
        ref={headRef}
        style={{
          transformBox: "fill-box",
          transformOrigin: "50% 70%",
          transition: "transform 120ms ease-out",
        }}
      >
        <path
          d="M6 5 23 16h18L58 5l-2.2 23.5C54 43 44 54 32 54S10 43 8.2 28.5Z"
          fill={`url(#${gradientId}-fur)`}
        />
        {/* inner ears */}
        <path d="M12.5 11 22 17l-6.4 3.6Z" fill="#ffd9c2" opacity="0.85" />
        <path d="M51.5 11 42 17l6.4 3.6Z" fill="#ffd9c2" opacity="0.85" />
        {/* muzzle */}
        <path
          d="M32 37c-6.6 0-11.5 3.2-11.5 7.6C20.5 50 26 53.6 32 53.6s11.5-3.6 11.5-9c0-4.4-4.9-7.6-11.5-7.6Z"
          fill="#fff1e8"
          opacity="0.92"
        />
        <g clipPath={`url(#${gradientId}-face)`}>
          {/* eye sockets */}
          <ellipse cx="24" cy="30.5" rx="5.6" ry="6.4" fill="#fff1e8" />
          <ellipse cx="40" cy="30.5" rx="5.6" ry="6.4" fill="#fff1e8" />
          <g
            ref={pupilsRef}
            style={{
              transformBox: "fill-box",
              transition: "transform 80ms linear",
            }}
          >
            <circle cx="24" cy="31.4" r="3" fill="#171310" />
            <circle cx="40" cy="31.4" r="3" fill="#171310" />
            <circle cx="25" cy="30.2" r="1" fill="#ffffff" opacity="0.9" />
            <circle cx="41" cy="30.2" r="1" fill="#ffffff" opacity="0.9" />
          </g>
        </g>
        {/* nose + smile */}
        <path d="M32 39.6c-1.9 0-3.4 1-3.4 2.1 0 1.2 1.6 2.2 3.4 2.2s3.4-1 3.4-2.2c0-1.1-1.5-2.1-3.4-2.1Z" fill="#171310" />
        <path
          d="M32 44.2v1.6m0 0c-.9 1.3-2.4 1.8-3.9 1.4m3.9-1.4c.9 1.3 2.4 1.8 3.9 1.4"
          stroke="#171310"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      </g>
    </svg>
  );
}
