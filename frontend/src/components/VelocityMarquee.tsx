import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

type VelocityMarqueeProps = {
  items: string[];
  className?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Endless type ribbon whose speed and skew follow scroll velocity: a slow
 * scroll drifts, a fast flick whips the row and slants it. Stops completely
 * for reduced-motion visitors.
 */
export function VelocityMarquee({ items, className = "" }: VelocityMarqueeProps) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 150, damping: 30, mass: 0.5 });
  const skewX = useTransform(smooth, (value) => clamp(-value * 0.0018, -2, 2));
  const x = useMotionValue(0);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    let half = track.scrollWidth / 2;
    let offset = 0;
    let raf = 0;
    let last = performance.now();

    const measure = () => {
      half = track.scrollWidth / 2;
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    const tick = (now: number) => {
      const delta = Math.min(now - last, 64);
      last = now;
      const boost = Math.min(Math.abs(smooth.get()) * 0.00055, 0.85);
      offset -= (0.05 + boost) * delta;
      if (half > 0) {
        while (offset <= -half) offset += half;
        while (offset > 0) offset -= half;
      }
      x.set(offset);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [reduced, smooth, x]);

  const row = [...items, ...items];

  return (
    <div className={`relative overflow-hidden py-2.5 ${className}`}>
      <p className="sr-only">{items.join(" · ")}</p>
      <motion.div
        aria-hidden="true"
        style={{ x: reduced ? 0 : x, skewX: reduced ? 0 : skewX }}
        className="will-change-transform"
      >
        <div ref={trackRef} className="flex w-max items-center">
          {row.map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center">
              <span className="display whitespace-nowrap px-5 text-[clamp(30px,5vw,68px)] leading-none">
                {item}
              </span>
              <span className="h-2.5 w-2.5 shrink-0 rotate-45 bg-fox" />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
