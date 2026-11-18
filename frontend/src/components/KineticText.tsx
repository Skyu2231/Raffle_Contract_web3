import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useIntroReady } from "./Preloader";

type KineticTextProps = {
  text: string;
  className?: string;
  /** How far a character can be pushed away from the pointer, in px. */
  strength?: number;
  /** Radius of the pointer's influence, in px. */
  range?: number;
};

/**
 * Kinetic typography: each glyph leans away from the cursor with an eased
 * follow, and fades in character-by-character after the intro curtain.
 */
export function KineticText({
  text,
  className = "",
  strength = 16,
  range = 130,
}: KineticTextProps) {
  const reduced = useReducedMotion();
  const ready = useIntroReady();
  const container = useRef<HTMLSpanElement>(null);
  const glyphs = useRef<(HTMLSpanElement | null)[]>([]);

  const words = text.split(" ");
  const chars = words.map((word) => Array.from(word));
  const total = chars.reduce((sum, glyphsInWord) => sum + glyphsInWord.length, 0);

  useEffect(() => {
    if (reduced) return;
    const root = container.current;
    if (!root) return;

    const nodes = glyphs.current.slice(0, total).filter((node): node is HTMLSpanElement => Boolean(node));
    if (!nodes.length) return;

    const currentX = nodes.map(() => 0);
    const currentY = nodes.map(() => 0);
    const targetX = nodes.map(() => 0);
    const targetY = nodes.map(() => 0);
    let pointerX = -9999;
    let pointerY = -9999;
    let raf = 0;

    const tick = () => {
      raf = 0;
      let moving = false;

      nodes.forEach((node, i) => {
        currentX[i] += (targetX[i] - currentX[i]) * 0.12;
        currentY[i] += (targetY[i] - currentY[i]) * 0.12;

        if (Math.abs(currentX[i]) < 0.01 && Math.abs(currentY[i]) < 0.01) {
          currentX[i] = 0;
          currentY[i] = 0;
          if (targetX[i] === 0 && targetY[i] === 0) {
            node.style.transform = "";
          } else {
            moving = true;
          }
          return;
        }

        moving = true;
        node.style.transform = `translate3d(${currentX[i].toFixed(2)}px, ${currentY[i].toFixed(2)}px, 0)`;
      });

      if (moving) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;

      nodes.forEach((node, i) => {
        const cx = node.offsetLeft + node.offsetWidth / 2;
        const cy = node.offsetTop + node.offsetHeight / 2;
        const dx = cx - pointerX;
        const dy = cy - pointerY;
        const dist = Math.hypot(dx, dy);
        const force = dist < range && dist > 0.01 ? (1 - dist / range) ** 2 : 0;
        targetX[i] = dist > 0.01 ? (dx / dist) * force * strength : 0;
        targetY[i] = dist > 0.01 ? (dy / dist) * force * strength : 0;
      });

      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      nodes.forEach((node) => {
        node.style.transform = "";
      });
    };
  }, [reduced, strength, range, total]);

  let glyphIndex = 0;

  return (
    <span ref={container} className={`relative inline ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {chars[wordIndex].map((char, charIndex) => {
              const i = glyphIndex++;
              return (
                <span
                  key={charIndex}
                  ref={(node) => {
                    glyphs.current[i] = node;
                  }}
                  className="inline-block will-change-transform"
                  style={{
                    opacity: ready || reduced ? 1 : 0,
                    transition: "opacity 620ms cubic-bezier(0.22,1,0.36,1)",
                    transitionDelay: `${Math.min(i * 18, 260)}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}
            {wordIndex < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        ))}
      </span>
    </span>
  );
}
