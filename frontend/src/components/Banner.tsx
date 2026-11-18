import { ArrowUpRight } from "./icons";

/** Thin announcement strip, styled like a protocol status line. */
export function Banner() {
  return (
    <div className="relative border-b border-uni-line/70 bg-uni-ink text-bone dark:border-uni-darkline dark:bg-[#050505]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] sm:px-8">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-fox" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fox" />
          </span>
          <span className="truncate">
            Live now — every draw is verifiable on-chain with Chainlink VRF v2.5
          </span>
        </span>
        <a
          href="#how-it-works"
          className="group hidden shrink-0 items-center gap-1.5 text-bone/60 transition hover:text-white sm:flex"
        >
          How it works
          <ArrowUpRight className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
