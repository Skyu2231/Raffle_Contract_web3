import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*<>_";

type ScrambleTextProps = {
  text: string;
  className?: string;
};

/**
 * Characters shuffle, then lock in from left to right while the pointer is on
 * the element. Screen readers always get the real label.
 */
export function ScrambleText({ text, className = "" }: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const timer = useRef<number | null>(null);

  const stop = () => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const reset = () => {
    stop();
    setDisplay(text);
  };

  const play = () => {
    if (reduced) return;
    stop();
    let step = 0;
    timer.current = window.setInterval(() => {
      step += 1;
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < step * 0.9) return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (step >= text.length + 2) {
        stop();
        setDisplay(text);
      }
    }, 26);
  };

  useEffect(() => stop, []);

  return (
    <span
      className={`relative inline-block ${className}`}
      onPointerEnter={play}
      onFocus={play}
      onPointerLeave={reset}
      onBlur={reset}
    >
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
