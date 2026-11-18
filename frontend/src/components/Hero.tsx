import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import type { RaffleStats } from "../hooks/useRaffle";
import { formatDuration, formatEth } from "../lib/format";
import { AppPreview } from "./AppPreview";
import { HeroScene } from "./HeroScene";
import { KineticText } from "./KineticText";
import { Magnetic } from "./Magnetic";
import { Parallax } from "./Parallax";
import { ParticleField } from "./ParticleField";
import { RevealText } from "./RevealText";
import { ScrambleText } from "./ScrambleText";
import { ArrowDown, ArrowUpRight, Sparkle } from "./icons";

type HeroProps = {
  stats: RaffleStats;
  countdown: number;
};

const TRUST = ["0% house edge", "Instant payout", "Self-custody", "VRF v2.5"];

function LiveStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-uni-muted dark:text-white/40">
        {label}
      </div>
      <div className="tnum mt-2 truncate font-display text-[22px] font-bold leading-none tracking-[-0.03em] sm:text-[26px]">
        {value}
      </div>
      <div className="mt-1.5 truncate font-mono text-[9px] uppercase tracking-[0.14em] text-uni-muted dark:text-white/40">
        {sub}
      </div>
    </div>
  );
}

export function Hero({ stats, countdown }: HeroProps) {
  const tickets = stats.players.length;
  const drawIn = !stats.open ? "Drawing…" : countdown > 0 ? formatDuration(countdown) : "Ready";

  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 90, damping: 30, mass: 0.4 });
  const skewX = useTransform(smoothVelocity, (value) =>
    Math.max(-4, Math.min(4, -value * 0.0025)),
  );

  return (
    <section className="relative overflow-hidden border-b border-uni-line dark:border-uni-darkline">
      <ParticleField className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(ellipse_at_50%_35%,black,transparent_78%)]" />
        <div className="absolute left-1/2 top-[-280px] h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,0,0.16),transparent_66%)] blur-2xl" />
        <div className="absolute -right-24 top-1/3 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,138,76,0.18),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-uni-line/80 py-3.5 font-mono text-[9px] uppercase tracking-[0.2em] text-uni-muted dark:border-uni-darkline dark:text-white/40">
          <span className="flex items-center gap-2">
            <Sparkle className="h-3 w-3 text-fox" />
            [ 01 — the round ]
          </span>
          <span className="hidden sm:inline">Provable randomness / Ethereum</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-fox" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fox" />
            </span>
            {stats.open ? "Entries open" : "Drawing"}
          </span>
        </div>

        <div className="relative pb-8 pt-10 sm:pt-14 lg:pt-16">
          <motion.h1
            className="display text-[clamp(56px,12.6vw,188px)] will-change-transform"
            style={{ skewX: reduced ? 0 : skewX }}
          >
            <span className="block">
              <RevealText text="One ticket" delay={0.05} />
            </span>
            <span className="mt-1 block sm:pl-[9vw]">
              <span className="serif-accent inline-block normal-case text-fox">
                <KineticText text="takes the pot." strength={14} />
              </span>
            </span>
          </motion.h1>

          <div className="pointer-events-none absolute right-0 top-0 hidden h-28 w-28 lg:block xl:h-36 xl:w-36">
            <svg viewBox="0 0 100 100" className="h-full w-full animate-orbit-slow">
              <defs>
                <path
                  id="hero-badge-path"
                  d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
                />
              </defs>
              <text className="fill-uni-muted font-mono text-[7px] uppercase tracking-[0.3em] dark:fill-white/45">
                <textPath href="#hero-badge-path">
                  provably fair · chainlink vrf v2.5 · on-chain ·
                </textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-2 w-2 rotate-45 bg-fox" />
            </span>
          </div>

          <div className="mt-10 grid gap-8 border-t border-uni-line pt-7 sm:mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-10 dark:border-uni-darkline">
            <div className="flex flex-col">
              <p className="max-w-[440px] text-[15px] leading-[1.65] text-uni-muted sm:text-base dark:text-white/55">
                Buy entries in ETH, watch the timer, and let Chainlink VRF hand the entire prize
                pool to one lucky ticket. The contract holds the pot — we never do.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                {TRUST.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[9px] uppercase tracking-[0.16em] text-uni-muted dark:text-white/40"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Magnetic strength={10}>
                  <a href="#raffle" className="btn-primary w-full sm:w-auto">
                    <span className="sheen" />
                    <ScrambleText text="Enter the raffle" />
                    <ArrowDown className="h-3.5 w-3.5" />
                  </a>
                </Magnetic>
                <a href="#how-it-works" className="btn-outline w-full sm:w-auto">
                  <ScrambleText text="How it works" />
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-5 border-t border-uni-line pt-5 lg:mt-auto lg:gap-8 dark:border-uni-darkline">
                <LiveStat
                  label="Prize pool"
                  value={`Ξ${formatEth(stats.prizePool, 3)}`}
                  sub="one winner"
                />
                <LiveStat
                  label="Tickets"
                  value={String(tickets)}
                  sub={tickets === 1 ? "single entry" : "in play"}
                />
                <LiveStat label="Draw in" value={drawIn} sub="automation" />
              </div>
            </div>

            <div
              data-cursor-label="Live field"
              className="relative order-first min-h-[280px] overflow-hidden rounded-[4px] border border-uni-line bg-[#080706] sm:min-h-[340px] lg:order-none dark:border-uni-darkline"
            >
              <HeroScene className="absolute inset-0 block h-full w-full" />
              <div className="pointer-events-none absolute inset-0 stage-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_88%)]" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
                <span className="flex items-center gap-2">
                  <Sparkle className="h-3 w-3 text-fox-glow" />
                  [ field 001 ]
                </span>
                <span className="hidden sm:inline">SDF / fluid / post</span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 border-t border-white/10 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                <span>move cursor to disturb</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-fox-glow" />
                  live render
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between gap-4 border-t border-uni-line py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-uni-muted dark:border-uni-darkline dark:text-white/40">
            <span>[ the app — live data ]</span>
            <span className="hidden items-center gap-2 sm:flex">
              Scroll to explore
              <ArrowDown className="h-3 w-3 animate-floaty" />
            </span>
          </div>
          <Parallax distance={28} className="relative pb-10 pt-6 sm:pb-14 sm:pt-10">
            <div data-cursor-label="Live app">
              <AppPreview stats={stats} countdown={countdown} />
            </div>
          </Parallax>
        </div>
      </div>

      {/* oversized watermark, clipped by the section */}
      <div
        className="pointer-events-none absolute -bottom-[4vw] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] font-extrabold uppercase leading-none tracking-tightest text-uni-ink/[0.03] dark:text-white/[0.03]"
        aria-hidden="true"
      >
        raffle
      </div>
    </section>
  );
}
