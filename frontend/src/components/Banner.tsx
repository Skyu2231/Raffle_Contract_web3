import { ArrowUpRight } from "./icons";

/** Thin announcement strip, like MetaMask's top bar. */
export function Banner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#ff7a2f] via-[#ff5c16] to-[#e2470a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.28)_50%,transparent_65%)] bg-[length:220%_100%] animate-shimmer" />
      <div className="relative mx-auto flex w-full max-w-[1200px] items-center justify-center gap-2 px-4 py-2 text-center text-[12px] font-medium sm:text-[13px]">
        <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-white">
          <span className="h-1.5 w-1.5 animate-pulse-ring rounded-full bg-white" />
        </span>
        <span className="truncate">
          Live now — every draw is verifiable on-chain with Chainlink VRF v2.5
        </span>
        <a
          href="#how-it-works"
          className="group hidden shrink-0 items-center gap-1 font-semibold underline decoration-white/40 underline-offset-4 transition hover:decoration-white sm:flex"
        >
          How it works
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
