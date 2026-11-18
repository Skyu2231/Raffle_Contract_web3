import { useAccount, useSwitchChain } from "wagmi";
import type { RaffleStats } from "../hooks/useRaffle";
import { useDrawWinner } from "../hooks/useRaffleActions";
import { CHAIN_META, explorerAddressUrl } from "../lib/config";
import { formatDuration, formatEth, pluralize } from "../lib/format";
import { AddressChip } from "./AddressChip";
import { useWalletUI } from "./ConnectWallet";
import { ArrowUpRight, Clock, Spinner, Ticket, Trophy } from "./icons";

type InfoColumnProps = {
  stats: RaffleStats;
  chainId: number;
  countdown: number;
};

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-uni-line bg-cream/60 p-3.5 transition duration-300 hover:border-fox-tint dark:border-uni-darkline dark:bg-white/[0.03] dark:hover:border-fox/30">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-uni-muted">
        {label}
      </div>
      <div className="tnum mt-1.5 text-lg font-bold leading-none tracking-[-0.02em]">{value}</div>
      {sub && <div className="mt-1.5 text-[11px] text-uni-muted">{sub}</div>}
    </div>
  );
}

export function InfoColumn({ stats, chainId, countdown }: InfoColumnProps) {
  const { isConnected, chainId: walletChainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { openConnect } = useWalletUI();
  const draw = useDrawWinner(stats.address, chainId);
  const chain = CHAIN_META[chainId];
  const explorer = stats.address ? explorerAddressUrl(chainId, stats.address) : null;
  const wrongNetwork = isConnected && walletChainId !== chainId;
  const hasWinner =
    stats.recentWinner && stats.recentWinner !== "0x0000000000000000000000000000000000000000";

  const handleDraw = () => {
    if (!isConnected) {
      openConnect();
      return;
    }
    if (wrongNetwork) {
      switchChain({ chainId });
      return;
    }
    void draw.draw();
  };

  return (
    <div className="rounded-4xl border border-uni-line bg-white p-5 shadow-card dark:border-uni-darkline dark:bg-uni-surface dark:shadow-card-dark">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-uni-muted">
          Round details
        </h3>
        <span className="flex items-center gap-1.5 rounded-full bg-fox-soft px-2.5 py-1 text-[11px] font-bold text-fox-deep dark:bg-fox/10 dark:text-fox-glow">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-fox" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fox" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <StatTile
          label="Prize pool"
          value={`Ξ${formatEth(stats.prizePool, 4)}`}
          sub={`${stats.players.length} ${pluralize(stats.players.length, "ticket")} in play`}
        />
        <StatTile
          label="Entry fee"
          value={stats.entranceFee !== undefined ? `Ξ${formatEth(stats.entranceFee, 4)}` : "—"}
          sub="per ticket"
        />
        <StatTile
          label="Next draw"
          value={!stats.open ? "Drawing…" : countdown > 0 ? formatDuration(countdown) : "Ready"}
          sub={!stats.open ? "VRF in flight" : `every ${formatDuration(stats.interval)}`}
        />
        <StatTile
          label="Your tickets"
          value={String(stats.ticketCount)}
          sub={stats.ticketCount > 0 ? "this round" : "you're not in yet"}
        />
      </div>

      {/* draw action */}
      <div
        className={`mt-3 rounded-2xl border px-4 py-3.5 transition ${
          stats.upkeepNeeded
            ? "border-fox-tint bg-fox-soft dark:border-fox/30 dark:bg-fox/10"
            : "border-uni-line bg-cream/60 dark:border-uni-darkline dark:bg-white/[0.03]"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                stats.upkeepNeeded
                  ? "bg-fox text-white"
                  : "bg-white text-uni-muted dark:bg-white/10 dark:text-white/70"
              }`}
            >
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-uni-muted">
                Draw status
              </div>
              <div className="text-sm font-semibold">
                {!stats.open
                  ? "Selecting winner…"
                  : stats.upkeepNeeded
                    ? "Time is up — draw now"
                    : countdown > 0
                      ? `${formatDuration(countdown)} remaining`
                      : "Waiting for entries"}
              </div>
            </div>
          </div>
          {stats.upkeepNeeded && (
            <button
              type="button"
              onClick={handleDraw}
              disabled={draw.isPending || draw.isConfirming}
              className="btn-ink shrink-0 px-4 py-2 text-xs"
            >
              {(draw.isPending || draw.isConfirming) && (
                <Spinner className="h-3.5 w-3.5 animate-spin" />
              )}
              {draw.isPending ? "Confirm…" : draw.isConfirming ? "Drawing…" : "Draw winner"}
            </button>
          )}
        </div>
        {draw.error && <p className="mt-2 text-xs text-[#d0342c]">{draw.error}</p>}
      </div>

      {/* last winner */}
      {hasWinner && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-fox-tint bg-gradient-to-r from-fox-soft to-white px-4 py-3.5 dark:border-fox/25 dark:from-fox/10 dark:to-transparent">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fox text-white">
            <Trophy className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-uni-muted">
              Last winner
            </div>
            <AddressChip
              address={stats.recentWinner as string}
              chainId={chainId}
              chars={5}
              showCopy
              className="text-sm font-semibold"
            />
          </div>
        </div>
      )}

      {/* contract */}
      {stats.address && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream px-3.5 py-3 dark:bg-white/[0.03]">
          <div className="flex items-center gap-2 text-xs text-uni-muted">
            <Ticket className="h-4 w-4 text-fox" />
            Contract on {chain?.name ?? "this chain"}
          </div>
          <div className="flex items-center gap-2.5">
            <AddressChip address={stats.address} chainId={chainId} chars={5} showCopy className="text-xs" />
            {explorer && (
              <a
                href={explorer}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-0.5 text-[11px] font-semibold text-uni-muted transition hover:text-fox-deep dark:hover:text-fox-glow"
              >
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
