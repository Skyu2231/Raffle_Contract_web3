import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Peak travel in px; positive moves against the scroll. */
  distance?: number;
};

/** Drifts its content vertically as the section passes through the viewport. */
export function Parallax({ children, className = "", distance = 60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} className={className} style={{ y: reduced ? 0 : y }}>
      {children}
    </motion.div>
  );
}
