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
    <section className="relative overflow-hidden bg-uni-ink text-white dark:bg-[#0f0d0b]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(255,92,22,0.28), transparent 45%), radial-gradient(circle at 85% 100%, rgba(255,138,76,0.18), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
            [ 01 — by the numbers ]
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-fox-glow" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fox" />
            </span>
            synced on-chain
          </span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
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
              <div className="border-l border-white/15 pl-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {item.label}
                </div>
                <div className="tnum mt-2 font-display text-[32px] font-extrabold leading-none tracking-[-0.03em] sm:text-[42px]">
                  {item.node}
                </div>
                <div className="mt-2 text-xs text-white/55">{item.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Aave-style trust strip */}
        <div className="mt-12 grid grid-cols-2 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.label}>
              <div className="font-display text-[24px] font-extrabold leading-none tracking-[-0.02em] text-white sm:text-[28px]">
                {item.value}
              </div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
