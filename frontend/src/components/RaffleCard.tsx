import { useState } from "react";
import type { ActivityItem } from "../hooks/useActivity";
import type { RaffleStats } from "../hooks/useRaffle";
import { ActivityTab } from "./ActivityTab";
import { EnterTab } from "./EnterTab";
import { PlayersTab } from "./PlayersTab";
import { Ticket } from "./icons";

type Tab = "enter" | "players" | "activity";

type RaffleCardProps = {
  stats: RaffleStats;
  chainId: number;
  countdown: number;
  activity: ActivityItem[];
  activityLoading: boolean;
};

export function RaffleCard({ stats, chainId, countdown, activity, activityLoading }: RaffleCardProps) {
  const [tab, setTab] = useState<Tab>("enter");

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "enter", label: "Enter" },
    { id: "players", label: "Players", badge: stats.players.length },
    { id: "activity", label: "Activity" },
  ];

  return (
    <section className="surface w-full p-2">
      <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fox-soft text-fox-deep dark:bg-fox/10 dark:text-fox-glow">
            <Ticket className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold tracking-[-0.01em]">Buy tickets</span>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            stats.open
              ? "bg-[#eaf8ee] text-[#15803d] dark:bg-[#16281a] dark:text-[#7ee2a0]"
              : "bg-fox-soft text-fox-deep dark:bg-fox/10 dark:text-fox-glow"
          }`}
        >
          <span
            className={`relative flex h-1.5 w-1.5 ${
              stats.open ? "bg-[#22c55e]" : "bg-fox"
            } rounded-full`}
          />
          {stats.open ? "Entries open" : "Drawing"}
        </span>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-cream-deep p-1 dark:bg-[#28231f]">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold transition duration-200 ${
                active
                  ? "bg-white text-uni-ink shadow-pill dark:bg-[#3a332d] dark:text-white"
                  : "text-uni-muted hover:text-uni-ink dark:hover:text-white"
              }`}
            >
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`tnum rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    active
                      ? "bg-fox-soft text-fox-deep dark:bg-fox/15 dark:text-fox-glow"
                      : "bg-black/5 text-uni-muted dark:bg-white/10"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 pt-4 sm:p-5 sm:pt-5">
        {tab === "enter" && <EnterTab stats={stats} chainId={chainId} countdown={countdown} />}
        {tab === "players" && <PlayersTab stats={stats} chainId={chainId} />}
        {tab === "activity" && (
          <ActivityTab items={activity} loading={activityLoading} chainId={chainId} />
        )}
      </div>
    </section>
  );
}
