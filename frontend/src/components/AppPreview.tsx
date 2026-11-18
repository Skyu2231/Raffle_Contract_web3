import type { RaffleStats } from "../hooks/useRaffle";
import { formatDuration, formatEth, formatPercent, pluralize } from "../lib/format";
import { Avatar } from "./Avatar";
import { Tilt } from "./Tilt";
import { ArrowUpRight, Bolt, Check, Clock, Shield, Ticket } from "./icons";

type AppPreviewProps = {
  stats: RaffleStats;
  countdown: number;
};

const ZERO = "0x0000000000000000000000000000000000000000";
const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** A fabricated app window showing the real round data — the "product shot". */
export function AppPreview({ stats, countdown }: AppPreviewProps) {
  const tickets = stats.players.length;
  const chance = tickets > 0 ? (1 / tickets) * 100 : 0;
  const progress = stats.interval > 0 ? Math.min(1, Math.max(0, countdown / stats.interval)) : 0;
  const ringOffset = CIRCUMFERENCE * (1 - progress);
  const fee = stats.entranceFee !== undefined ? formatEth(stats.entranceFee * 3n, 4) : "—";
  const hasWinner = Boolean(stats.recentWinner) && stats.recentWinner !== ZERO;

  return (
    <div className="relative mx-auto w-full max-w-[880px]">
      <div
        className="pointer-events-none absolute -inset-10 rounded-[56px] bg-[radial-gradient(ellipse_at_center,rgba(255,138,76,0.28),transparent_65%)] blur-2xl"
        aria-hidden="true"
      />

      <Tilt max={5} className="relative rounded-[28px]">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-fox-tint/80 via-white to-fox-soft p-[1.5px] shadow-[0_40px_90px_-40px_rgba(255,92,22,0.55)] dark:from-fox/30 dark:via-[#2a231e] dark:to-fox/10">
          <div className="pointer-events-none absolute -inset-[120%] animate-orbit bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,92,22,0.45)_12%,transparent_28%)]" />

          <div className="relative overflow-hidden rounded-[26px] bg-white dark:bg-uni-surface">
            {/* window chrome */}
            <div className="flex items-center gap-3 border-b border-uni-line/80 bg-cream/70 px-4 py-3 dark:border-uni-darkline dark:bg-white/[0.03]">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbfae]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffe0a3]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#c7e8c0]" />
              </div>
              <div className="mx-auto flex items-center gap-1.5 rounded-full border border-uni-line bg-white px-3 py-1 text-[11px] font-medium text-uni-muted dark:border-uni-darkline dark:bg-white/5">
                <Shield className="h-3 w-3 text-fox" />
                app.raffle.xyz
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-uni-muted/60" />
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-[1.12fr_1fr] sm:p-5">
              {/* left: buy panel */}
              <div className="rounded-2xl border border-uni-line/90 bg-white p-4 dark:border-uni-darkline dark:bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-uni-muted">
                    Prize pool
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-fox-soft px-2 py-0.5 text-[10px] font-bold text-fox-deep dark:bg-fox/10 dark:text-fox-glow">
                    <span className="relative flex h-1.5 w-1.5 rounded-full bg-fox">
                      {stats.open && (
                        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-fox" />
                      )}
                    </span>
                    {stats.open ? "Live" : "Drawing"}
                  </span>
                </div>

                <div className="tnum mt-2 text-[34px] font-extrabold leading-none tracking-[-0.04em] sm:text-[38px]">
                  Ξ{formatEth(stats.prizePool, 4)}
                </div>
                <div className="mt-1.5 text-[11px] text-uni-muted">
                  {tickets} {pluralize(tickets, "ticket")} in play · chance {formatPercent(chance, 1)}
                </div>

                <div className="mt-3.5 rounded-xl border border-uni-line/90 p-2.5 dark:border-uni-darkline">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-uni-muted">
                      Tickets
                    </span>
                    <div className="flex items-center gap-1 rounded-full bg-cream-deep px-1.5 py-0.5 dark:bg-white/5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-uni-muted shadow-sm dark:bg-white/10">
                        −
                      </span>
                      <span className="tnum w-4 text-center text-xs font-bold">3</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-uni-muted shadow-sm dark:bg-white/10">
                        +
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="tnum text-sm font-bold">Ξ{fee}</span>
                    <span className="text-[10px] text-uni-muted">
                      {stats.entranceFee !== undefined ? `Ξ${formatEth(stats.entranceFee, 4)} each` : ""}
                    </span>
                  </div>
                </div>

                <div className="relative mt-3 flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-[#ff7a2f] to-[#ef4e07] py-2.5 text-[12px] font-semibold text-white shadow-fox-btn">
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.35)_50%,transparent_65%)] bg-[length:220%_100%] animate-shimmer" />
                  <Ticket className="h-3.5 w-3.5" />
                  Enter raffle
                </div>
              </div>

              {/* right: countdown + winner */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-uni-line/90 bg-cream/50 p-3 dark:border-uni-darkline dark:bg-white/[0.03]">
                  <div className="relative h-[86px] w-[86px] shrink-0">
                    <svg viewBox="0 0 86 86" className="h-full w-full -rotate-90">
                      <circle cx="43" cy="43" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="6" className="text-uni-line dark:text-uni-darkline" />
                      <circle
                        cx="43"
                        cy="43"
                        r={RADIUS}
                        fill="none"
                        stroke="url(#ring-grad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={ringOffset}
                        style={{ transition: "stroke-dashoffset 1s linear" }}
                      />
                      <defs>
                        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#ff8a4c" />
                          <stop offset="1" stopColor="#e2470a" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Clock className="h-3.5 w-3.5 text-fox" />
                      <span className="tnum mt-0.5 text-[11px] font-bold leading-none">
                        {!stats.open ? "VRF" : countdown > 0 ? formatDuration(countdown) : "Ready"}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-uni-muted">
                      Next draw
                    </div>
                    <div className="mt-0.5 text-sm font-bold">
                      {!stats.open ? "Selecting winner" : "Automated"}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-uni-muted">
                      <Bolt className="h-3 w-3 text-fox" />
                      Chainlink Automation
                    </div>
                  </div>
                </div>

                <div className="flex-1 rounded-2xl border border-uni-line/90 bg-white p-3 dark:border-uni-darkline dark:bg-white/[0.02]">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-uni-muted">
                    {hasWinner ? "Last winner" : "Your position"}
                  </div>
                  {hasWinner ? (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar address={stats.recentWinner as string} size={26} />
                      <div className="min-w-0">
                        <div className="tnum truncate text-[11px] font-semibold">
                          {`${(stats.recentWinner as string).slice(0, 6)}…${(stats.recentWinner as string).slice(-4)}`}
                        </div>
                        <div className="text-[10px] text-uni-muted">took the whole pot</div>
                      </div>
                      <Check className="ml-auto h-4 w-4 shrink-0 text-[#22c55e]" />
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fox-soft text-fox-deep dark:bg-fox/10 dark:text-fox-glow">
                        <Ticket className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <div className="tnum text-[11px] font-semibold">
                          {stats.ticketCount} {pluralize(stats.ticketCount, "ticket")} owned
                        </div>
                        <div className="text-[10px] text-uni-muted">be the next winner</div>
                      </div>
                    </div>
                  )}
                  <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-uni-line/80 pt-2.5 text-center dark:border-uni-darkline">
                    {[
                      { label: "Players", value: tickets },
                      { label: "Owned", value: stats.ticketCount },
                      { label: "Round", value: "∞" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="tnum text-[12px] font-bold">{item.value}</div>
                        <div className="text-[9px] uppercase tracking-wide text-uni-muted">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tilt>

      {/* floating UI chips */}
      <div className="pointer-events-none absolute -left-5 top-[18%] hidden animate-floaty items-center gap-2 rounded-2xl border border-uni-line bg-white/95 px-3 py-2 text-[11px] font-semibold shadow-card backdrop-blur sm:flex dark:border-uni-darkline dark:bg-uni-surface/95">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fox text-white">
          <Shield className="h-3 w-3" />
        </span>
        VRF verified
      </div>
      <div
        className="pointer-events-none absolute -right-4 bottom-[12%] hidden animate-floaty-slow items-center gap-2 rounded-2xl border border-uni-line bg-white/95 px-3 py-2 text-[11px] font-semibold shadow-card backdrop-blur sm:flex dark:border-uni-darkline dark:bg-uni-surface/95"
        style={{ animationDelay: "-2.5s" }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fox-soft text-fox-deep dark:bg-fox/10 dark:text-fox-glow">
          <Ticket className="h-3 w-3" />
        </span>
        100% to the winner
      </div>
    </div>
  );
}
