import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Custom cursor: an instant dot plus a lagging ring. It inverts against the
 * page (mix-blend-difference) and swells over anything interactive. Pointer
 * and reduced-motion visitors keep their native cursor.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("a, button, [data-cursor='hover']")));
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[115] hidden mix-blend-difference md:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <motion.div
        className="absolute h-[5px] w-[5px] rounded-full bg-white"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute h-9 w-9 rounded-full border border-white/70"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 1 : 0.55 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
    </div>
  );
}
