import type { ActivityItem } from "../hooks/useActivity";
import { explorerTxUrl } from "../lib/config";
import { AddressChip } from "./AddressChip";
import { Avatar } from "./Avatar";
import { Clock, Spinner, Trophy } from "./icons";

type ActivityTabProps = {
  items: ActivityItem[];
  loading: boolean;
  chainId: number;
};

export function ActivityTab({ items, loading, chainId }: ActivityTabProps) {
  return (
    <div className="animate-rise">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">Activity</div>
          <div className="mt-0.5 text-sm text-uni-muted">Recent on-chain raffle events</div>
        </div>
        {loading && <Spinner className="h-4 w-4 animate-spin text-uni-muted" />}
      </div>

      {items.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-uni-line px-6 py-12 text-center dark:border-uni-darkline">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-uni-muted dark:bg-[#28231f]">
            <Clock className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold">Nothing here yet</p>
          <p className="mt-1 max-w-[250px] text-xs text-uni-muted">
            Entries and winners from this contract will show up in real time.
          </p>
        </div>
      ) : (
        <div className="no-scrollbar mt-4 max-h-[352px] space-y-0.5 overflow-y-auto pr-1">
          {items.map((item) => {
            const txUrl = explorerTxUrl(chainId, item.txHash);
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-cream dark:hover:bg-white/5"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    item.kind === "win"
                      ? "bg-fox-soft text-fox-deep dark:bg-[#33251a] dark:text-fox-glow"
                      : "bg-cream text-uni-muted dark:bg-[#28231f]"
                  }`}
                >
                  {item.kind === "win" ? <Trophy className="h-4 w-4" /> : <Avatar address={item.player} size={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <AddressChip address={item.player} chainId={chainId} chars={4} />
                    <span className="text-uni-muted">
                      {item.kind === "win" ? "won the raffle" : "entered"}
                    </span>
                  </div>
                  <div className="text-[11px] text-uni-muted">
                    Block {item.blockNumber.toString()}
                  </div>
                </div>
                {txUrl ? (
                  <a
                    href={txUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-uni-line px-2 py-1 text-[11px] font-semibold text-uni-muted transition hover:text-uni-ink dark:border-uni-darkline dark:hover:text-white"
                  >
                    tx
                  </a>
                ) : (
                  <span className="text-[11px] text-uni-muted">tx</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
