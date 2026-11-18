import { useEffect, useState } from "react";

/** Thin fox-orange progress bar pinned above the page chrome. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
      <div
        className="h-full origin-left bg-gradient-to-r from-fox-glow via-fox to-fox-deep shadow-[0_0_12px_rgba(255,92,22,0.7)]"
        style={{ transform: `scaleX(${progress})`, transition: "transform 90ms linear" }}
      />
    </div>
  );
}
