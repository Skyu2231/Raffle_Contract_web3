import { useCallback, useEffect, useState } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { raffleAbi } from "../lib/raffleAbi";

export type ActivityItem = {
  id: string;
  kind: "enter" | "win";
  player: `0x${string}`;
  blockNumber: bigint;
  txHash: `0x${string}`;
};

const LOOKBACK_BLOCKS = 9_000n;
const MAX_ITEMS = 14;

export function useActivity(chainId: number | undefined, address: `0x${string}` | undefined) {
  const publicClient = usePublicClient({ chainId });
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!address || !publicClient) return;
    setLoading(true);
    try {
      const latest = await publicClient.getBlockNumber();
      const fromBlock = latest > LOOKBACK_BLOCKS ? latest - LOOKBACK_BLOCKS : 0n;

      const [enters, wins] = await Promise.all([
        publicClient.getContractEvents({
          address,
          abi: raffleAbi,
          eventName: "RaffleEnter",
          fromBlock,
          toBlock: latest,
        }),
        publicClient.getContractEvents({
          address,
          abi: raffleAbi,
          eventName: "WinnerPicked",
          fromBlock,
          toBlock: latest,
        }),
      ]);

      const mapped: ActivityItem[] = [
        ...enters.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          kind: "enter" as const,
          player: (log.args.player ?? "0x") as `0x${string}`,
          blockNumber: log.blockNumber ?? 0n,
          txHash: log.transactionHash as `0x${string}`,
        })),
        ...wins.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          kind: "win" as const,
          player: (log.args.player ?? "0x") as `0x${string}`,
          blockNumber: log.blockNumber ?? 0n,
          txHash: log.transactionHash as `0x${string}`,
        })),
      ];

      mapped.sort((a, b) => (a.blockNumber === b.blockNumber ? 0 : a.blockNumber > b.blockNumber ? -1 : 1));
      setItems(mapped.slice(0, MAX_ITEMS));
    } catch {
      // A failed historical lookup should never break the page.
    } finally {
      setLoading(false);
    }
  }, [address, publicClient]);

  useEffect(() => {
    void load();
  }, [load]);

  useWatchContractEvent({
    address,
    abi: raffleAbi,
    eventName: "RaffleEnter",
    enabled: Boolean(address),
    onLogs: (logs) => {
      const fresh = logs
        .map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          kind: "enter" as const,
          player: (log.args.player ?? "0x") as `0x${string}`,
          blockNumber: log.blockNumber ?? 0n,
          txHash: log.transactionHash as `0x${string}`,
        }))
        .reverse();
      setItems((current) => [...fresh, ...current].slice(0, MAX_ITEMS));
    },
  });

  useWatchContractEvent({
    address,
    abi: raffleAbi,
    eventName: "WinnerPicked",
    enabled: Boolean(address),
    onLogs: (logs) => {
      const fresh = logs
        .map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          kind: "win" as const,
          player: (log.args.player ?? "0x") as `0x${string}`,
          blockNumber: log.blockNumber ?? 0n,
          txHash: log.transactionHash as `0x${string}`,
        }))
        .reverse();
      setItems((current) => [...fresh, ...current].slice(0, MAX_ITEMS));
    },
  });

  return { items, loading, reload: load };
}
