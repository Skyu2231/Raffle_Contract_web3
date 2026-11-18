import { useRef, type PointerEvent, type ReactNode } from "react";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  glare?: boolean;
};

/**
 * Pointer-tracked 3D tilt with an optional light glare. Skipped entirely for
 * coarse pointers and reduced-motion visitors.
 */
export function Tilt({ children, className = "", max = 7, glare = true }: TiltProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const enabled = () => {
    if (typeof window === "undefined") return false;
    return (
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(pointer: coarse)").matches
    );
  };

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = wrapperRef.current;
    if (!el || !enabled()) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--tilt-y", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--tilt-x", `${(-(py - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--glare", "1");
  };

  const handleLeave = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--glare", "0");
  };

  return (
    <div
      ref={wrapperRef}
      className={`tilt ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
    >
      {children}
      {glare && (
        <div
          className="tilt-glare pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
