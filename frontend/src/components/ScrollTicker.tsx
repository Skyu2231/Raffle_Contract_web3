import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type ScrollTickerProps = {
  items: string[];
  className?: string;
};

/**
 * Oversized kinetic type that slides horizontally as the band crosses the
 * viewport. The words are duplicated so the row never runs out of glyphs.
 */
export function ScrollTicker({ items, className = "" }: ScrollTickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-38%"]);
  const row = [...items, ...items, ...items];

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <p className="sr-only">{items.join(" · ")}</p>
      <motion.div
        aria-hidden="true"
        style={{ x: reduced ? 0 : x }}
        className="flex w-max items-center gap-6 whitespace-nowrap will-change-transform sm:gap-10"
      >
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-6 sm:gap-10">
            <span
              className={`display text-[16vw] leading-[0.8] sm:text-[11vw] ${
                index % 3 === 1 ? "text-stroke-accent" : index % 3 === 2 ? "text-stroke" : ""
              }`}
            >
              {item}
            </span>
            <span className="mt-2 h-3 w-3 shrink-0 rotate-45 bg-fox sm:h-4 sm:w-4" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
