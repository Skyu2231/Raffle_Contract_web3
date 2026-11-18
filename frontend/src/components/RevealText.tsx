import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useIntroReady } from "./Preloader";

type RevealTextProps = {
  text: string;
  className?: string;
  /** Delay before the first word, in seconds. */
  delay?: number;
  /** Extra delay between words, in seconds. */
  stagger?: number;
};

/**
 * Masks each word and slides it up from below once the line scrolls into
 * view. Words keep their natural spacing, so wrapping still reads correctly.
 */
export function RevealText({ text, className = "", delay = 0, stagger = 0.055 }: RevealTextProps) {
  const reduced = useReducedMotion();
  const ready = useIntroReady();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const show = Boolean(reduced) || (ready && inView);
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden pb-[0.09em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={false}
            animate={show ? { y: "0%", rotate: 0 } : { y: "115%", rotate: 2 }}
            transition={{
              duration: 0.95,
              delay: delay + index * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
