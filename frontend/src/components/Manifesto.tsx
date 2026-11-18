import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Reveal } from "./Reveal";

const STATEMENT = [
  { text: "A" },
  { text: "lottery" },
  { text: "should" },
  { text: "be" },
  { text: "a", accent: true },
  { text: "math", accent: true },
  { text: "problem,", accent: true },
  { text: "not" },
  { text: "a" },
  { text: "promise." },
  { text: "No" },
  { text: "house." },
  { text: "No" },
  { text: "middleman." },
  { text: "Just" },
  { text: "a" },
  { text: "contract," },
  { text: "a" },
  { text: "timer," },
  { text: "and" },
  { text: "one" },
  { text: "ticket", accent: true },
  { text: "that" },
  { text: "takes" },
  { text: "everything.", accent: true },
];

function FlowWord({
  text,
  accent,
  index,
  total,
  progress,
}: {
  text: string;
  accent?: boolean;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.85;
  const end = Math.min(start + 0.12, 1);
  const opacity = useTransform(progress, [start, end], [0.14, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.24em] inline-block ${accent ? "serif-accent normal-case text-fox" : ""}`}
    >
      {text}
    </motion.span>
  );
}

function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.2">
        {Array.from({ length: 12 }).map((_, index) => (
          <line
            key={index}
            x1="50"
            y1="50"
            x2={50 + 44 * Math.cos((index * Math.PI) / 6)}
            y2={50 + 44 * Math.sin((index * Math.PI) / 6)}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const spin = useTransform(scrollYProgress, [0, 1], [0, 210]);

  return (
    <section className="relative overflow-hidden border-y border-uni-line bg-cream-deep/40 dark:border-uni-darkline dark:bg-[#0f0e0c]">
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_75%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-8 lg:py-24">
        <div className="flex items-center justify-between gap-4 border-b border-uni-line py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-uni-muted dark:border-uni-darkline dark:text-white/40">
          <span>[ 05 — the wager ]</span>
          <span className="hidden sm:inline">Read slowly / it is the whole product</span>
        </div>

        <div ref={ref} className="relative mt-12 lg:mt-16">
          <motion.div
            aria-hidden="true"
            style={{ rotate: reduced ? 0 : spin }}
            className="pointer-events-none absolute -right-8 -top-16 hidden h-40 w-40 text-fox/60 lg:block xl:h-56 xl:w-56"
          >
            <Asterisk className="h-full w-full" />
          </motion.div>

          <p className="max-w-[1120px] font-display text-[clamp(28px,4.6vw,62px)] font-bold uppercase leading-[1.02] tracking-[-0.03em]">
            {reduced
              ? STATEMENT.map((word, index) => (
                  <span
                    key={`${word.text}-${index}`}
                    className={`mr-[0.24em] inline-block ${
                      word.accent ? "serif-accent normal-case text-fox" : ""
                    }`}
                  >
                    {word.text}
                  </span>
                ))
              : STATEMENT.map((word, index) => (
                  <FlowWord
                    key={`${word.text}-${index}`}
                    text={word.text}
                    accent={word.accent}
                    index={index}
                    total={STATEMENT.length}
                    progress={scrollYProgress}
                  />
                ))}
          </p>

          <Reveal delay={120} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-uni-line pt-5 dark:border-uni-darkline">
            {["No admin withdrawal", "No account", "No house cut"].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-uni-muted dark:text-white/40"
              >
                <span className="h-1.5 w-1.5 rotate-45 bg-fox" />
                {item}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
