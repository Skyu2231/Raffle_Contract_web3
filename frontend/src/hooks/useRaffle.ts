import { useMemo } from "react";
import { useAccount, useReadContracts, useWatchContractEvent } from "wagmi";
import { raffleAbi } from "../lib/raffleAbi";
import { getRaffleAddress } from "../lib/config";

export type RaffleStats = {
  address?: `0x${string}`;
  configured: boolean;
  open: boolean;
  calculating: boolean;
  entranceFee?: bigint;
  prizePool?: bigint;
  players: readonly `0x${string}`[];
  ticketCount: number;
  recentWinner?: `0x${string}`;
  timeRemaining: number;
  interval: number;
  upkeepNeeded: boolean;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

type Result<T> = { status: "success"; result: T } | { status: "failure"; error: Error };

export function useRaffle(chainId: number | undefined): RaffleStats {
  const address = getRaffleAddress(chainId);
  const { address: account } = useAccount();

  const contracts = [
    { address, abi: raffleAbi, functionName: "getRaffleState" },
    { address, abi: raffleAbi, functionName: "getEntranceFee" },
    { address, abi: raffleAbi, functionName: "getPrizePool" },
    { address, abi: raffleAbi, functionName: "getPlayers" },
    { address, abi: raffleAbi, functionName: "getRecentWinner" },
    { address, abi: raffleAbi, functionName: "getTimeRemaining" },
    { address, abi: raffleAbi, functionName: "getInterval" },
  ] as const;

  const query = useReadContracts({
    allowFailure: true,
    contracts,
    query: {
      enabled: Boolean(address),
      refetchInterval: 5_000,
      refetchOnWindowFocus: true,
    },
  });

  const { refetch } = query;

  // Re-read as soon as a ticket is sold or a winner is drawn.
  useWatchContractEvent({
    address,
    abi: raffleAbi,
    eventName: "RaffleEnter",
    enabled: Boolean(address),
    onLogs: () => void refetch(),
  });

  useWatchContractEvent({
    address,
    abi: raffleAbi,
    eventName: "WinnerPicked",
    enabled: Boolean(address),
    onLogs: () => void refetch(),
  });

  return useMemo(() => {
    const result = (index: number): unknown => {
      const entry = query.data?.[index] as Result<unknown> | undefined;
      return entry && entry.status === "success" ? entry.result : undefined;
    };

    const players = (result(3) as readonly `0x${string}`[] | undefined) ?? [];
    const raffleState = Number(result(0) ?? 0);
    const prizePool = result(2) as bigint | undefined;
    const timeRemaining = Number(result(5) ?? 0);
    const open = raffleState === 0;

    const ticketCount = account
      ? players.filter((player) => player.toLowerCase() === account.toLowerCase()).length
      : 0;

    const firstError = query.error ?? null;

    return {
      address,
      configured: Boolean(address),
      open,
      calculating: raffleState === 1,
      entranceFee: result(1) as bigint | undefined,
      prizePool,
      players,
      ticketCount,
      recentWinner: result(4) as `0x${string}` | undefined,
      timeRemaining,
      interval: Number(result(6) ?? 0),
      upkeepNeeded:
        open &&
        timeRemaining === 0 &&
        players.length > 0 &&
        prizePool !== undefined &&
        prizePool > 0n,
      loading: query.isLoading,
      error: firstError,
      refetch: () => void refetch(),
    };
  }, [query.data, query.error, query.isLoading, account, address, refetch]);
}
