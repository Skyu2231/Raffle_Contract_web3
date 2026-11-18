import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE = [0.76, 0, 0.24, 1] as const;
const INTRO_EVENT = "raffle:intro-done";

/** True once the intro curtain has finished (or immediately for reduced motion). */
export function useIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener(INTRO_EVENT, onDone);
    return () => window.removeEventListener(INTRO_EVENT, onDone);
  }, []);

  return ready;
}

/**
 * Award-site style intro: a percentage counter on a black stage, then two
 * curtain panels split away to reveal the page. Runs once per load, skipped
 * entirely for reduced-motion visitors.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const previousOverflow = useRef("");
  const previousHtmlOverflow = useRef("");

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }

    const duration = 1500;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 180);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    previousOverflow.current = document.body.style.overflow;
    previousHtmlOverflow.current = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow.current;
      document.documentElement.style.overflow = previousHtmlOverflow.current;
    };
  }, [reduced]);

  useEffect(() => {
    if (!done || reduced) return;
    document.body.style.overflow = previousOverflow.current || "";
    document.documentElement.style.overflow = previousHtmlOverflow.current || "";
    // let the curtains open before the hero choreography starts
    const timer = window.setTimeout(() => window.dispatchEvent(new Event(INTRO_EVENT)), 450);
    return () => window.clearTimeout(timer);
  }, [done, reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader-top"
          className="fixed inset-x-0 top-0 z-[121] h-1/2 bg-void"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        />
      )}
      {!done && (
        <motion.div
          key="preloader-bottom"
          className="fixed inset-x-0 bottom-0 z-[121] h-1/2 bg-void"
          exit={{ y: "100%" }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        />
      )}
      {!done && (
        <motion.div
          key="preloader-content"
          className="pointer-events-none fixed inset-0 z-[122] flex flex-col justify-between p-5 text-[#f4f1ea] sm:p-8"
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">
            <span>raffle / protocol</span>
            <span>est. 2026</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="font-display text-[13vw] font-extrabold uppercase leading-[0.78] tracking-tightest sm:text-[9vw]">
                One ticket
              </div>
              <div className="serif-accent text-[13vw] leading-[0.9] text-fox sm:text-[9vw]">
                takes the pot
              </div>
            </div>
            <div className="tnum shrink-0 font-mono text-4xl font-medium leading-none sm:text-6xl">
              {String(count).padStart(3, "0")}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/15 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>Loading motion</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-fox" />
              Chainlink VRF v2.5
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
