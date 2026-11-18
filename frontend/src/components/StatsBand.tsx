import type { RaffleStats } from "../hooks/useRaffle";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";
import { formatDuration } from "../lib/format";

type StatsBandProps = {
  stats: RaffleStats;
};

const toEth = (wei?: bigint) => (wei === undefined ? 0 : Number(wei / 10n ** 12n) / 1e6);

const TRUST = [
  { value: "0%", label: "house cut" },
  { value: "100%", label: "to one ticket" },
  { value: "1", label: "winner per round" },
  { value: "v2.5", label: "chainlink vrf" },
];

export function StatsBand({ stats }: StatsBandProps) {
  return (
    <section className="relative overflow-hidden bg-uni-ink text-bone dark:bg-[#070706]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 0%, rgba(255,77,0,0.22), transparent 45%), radial-gradient(circle at 90% 100%, rgba(255,138,76,0.14), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-[0.16] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[6vw] top-1/2 hidden -translate-y-1/2 select-none font-display text-[30vw] font-extrabold uppercase leading-none tracking-tightest text-white/[0.035] lg:block"
        aria-hidden="true"
      >
        fair
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-col gap-2 border-b border-white/15 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45">
            [ 03 — by the numbers ]
          </span>
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-fox-glow" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fox" />
            </span>
            synced on-chain
          </span>
        </div>

        <div className="grid gap-x-6 gap-y-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Prize pool",
              node: <CountUp value={toEth(stats.prizePool)} decimals={4} prefix="Ξ" />,
              sub: "goes to one ticket",
            },
            {
              label: "Tickets in play",
              node: <CountUp value={stats.players.length} />,
              sub: stats.players.length === 1 ? "one entry" : "equal chances",
            },
            {
              label: "Entry fee",
              node: <CountUp value={toEth(stats.entranceFee)} decimals={4} prefix="Ξ" />,
              sub: "per ticket",
            },
            {
              label: "Draw cadence",
              node: <span className="uppercase">{formatDuration(stats.interval)}</span>,
              sub: !stats.open ? "VRF in flight" : "Chainlink Automation",
            },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 80}>
              <div className="border-t border-white/20 pt-5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                    {item.label}
                  </span>
                  <span className="font-mono text-[9px] text-white/25">0{index + 1}</span>
                </div>
                <div className="tnum mt-6 font-display text-[clamp(36px,4.6vw,58px)] font-extrabold leading-[0.9] tracking-tightest">
                  {item.node}
                </div>
                <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                  {item.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.label}>
              <div className="font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] sm:text-[30px]">
                {item.value}
              </div>
              <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
