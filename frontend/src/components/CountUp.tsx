import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

function format(value: number, decimals: number): string {
  const fixed = value.toFixed(decimals);
  const [whole, fraction] = fixed.split(".");
  const wholeFormatted = Number(whole).toLocaleString("en-US");
  const trimmed = fraction?.replace(/0+$/, "");
  return trimmed ? `${wholeFormatted}.${trimmed}` : wholeFormatted;
}

/**
 * Aave-style number flow: counts up from the previous value when it scrolls
 * into view, then animates between updates. Jumps straight to the value when
 * reduced motion is requested.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1100,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(0);
  const [display, setDisplay] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = value;
      setDisplay(value);
      return;
    }

    const from = current.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (value - from) * eased;
      current.current = next;
      setDisplay(next);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value, visible, duration]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {prefix}
      {format(display, decimals)}
      {suffix}
    </span>
  );
}
