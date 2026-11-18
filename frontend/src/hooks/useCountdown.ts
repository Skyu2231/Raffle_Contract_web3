import { useEffect, useRef, useState } from "react";

/**
 * Takes the on-chain "seconds remaining" value (refreshed every few seconds)
 * and ticks it down locally so the UI never looks frozen between reads.
 */
export function useCountdown(seconds: number | undefined): number {
  const [now, setNow] = useState(() => Date.now());
  const anchor = useRef({ value: seconds ?? 0, at: Date.now() });

  useEffect(() => {
    anchor.current = { value: seconds ?? 0, at: Date.now() };
  }, [seconds]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  const elapsed = Math.floor((now - anchor.current.at) / 1_000);
  return Math.max(0, anchor.current.value - elapsed);
}
