import { useMemo } from "react";
import { useAccount } from "wagmi";
import type { RaffleStats } from "../hooks/useRaffle";
import { pluralize, truncateAddress } from "../lib/format";
import { AddressChip } from "./AddressChip";
import { Avatar } from "./Avatar";
import { Ticket } from "./icons";

type PlayersTabProps = {
  stats: RaffleStats;
  chainId: number;
};

export function PlayersTab({ stats, chainId }: PlayersTabProps) {
  const { address: account } = useAccount();

  const grouped = useMemo(() => {
    const counts = new Map<string, number>();
    for (const player of stats.players) {
      const key = player.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([player, tickets]) => ({ player: player as `0x${string}`, tickets }))
      .sort((a, b) => (b.tickets === a.tickets ? 0 : b.tickets - a.tickets));
  }, [stats.players]);

  return (
    <div className="animate-rise">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">
            {stats.players.length} {pluralize(stats.players.length, "ticket")}
          </div>
          <div className="mt-0.5 text-sm text-uni-muted">
            {grouped.length} {pluralize(grouped.length, "player")} in this round
          </div>
        </div>
        <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-uni-muted dark:bg-[#28231f]">
          Live
        </span>
      </div>

      {grouped.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-uni-line px-6 py-12 text-center dark:border-uni-darkline">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-uni-muted dark:bg-[#28231f]">
            <Ticket className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold">No tickets yet</p>
          <p className="mt-1 max-w-[240px] text-xs text-uni-muted">
            Be the first one in. The pot keeps growing with every ticket.
          </p>
        </div>
      ) : (
        <div className="no-scrollbar mt-4 max-h-[352px] space-y-0.5 overflow-y-auto pr-1">
          {grouped.map((player, index) => {
            const isYou = account && player.player.toLowerCase() === account.toLowerCase();
            return (
              <div
                key={player.player}
                className={`flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-cream dark:hover:bg-white/5 ${
                  isYou ? "bg-fox-soft dark:bg-[#2f2118]" : ""
                }`}
              >
                <span className="tnum w-5 text-xs font-medium text-uni-muted">#{index + 1}</span>
                <Avatar address={player.player} size={30} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <AddressChip
                      address={player.player}
                      chainId={chainId}
                      chars={4}
                      className="text-sm"
                    />
                    {isYou && (
                      <span className="rounded-full bg-fox-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fox-deep dark:bg-[#3a2116] dark:text-fox">
                        you
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-uni-muted">{truncateAddress(player.player, 8)}</div>
                </div>
                <span className="flex items-center gap-1 rounded-full border border-uni-line px-2 py-1 text-xs font-semibold dark:border-uni-darkline">
                  <Ticket className="h-3 w-3" />
                  {player.tickets}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
