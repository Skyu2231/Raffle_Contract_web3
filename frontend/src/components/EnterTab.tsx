import { useEffect, useState, type ReactNode } from "react";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { useEnterRaffle } from "../hooks/useRaffleActions";
import type { RaffleStats } from "../hooks/useRaffle";
import { CHAIN_META, explorerTxUrl } from "../lib/config";
import { formatEth, formatDuration, formatPercent, pluralize } from "../lib/format";
import { useWalletUI } from "./ConnectWallet";
import { ArrowUpRight, Fox, Minus, Plus, Spinner, Ticket } from "./icons";

type EnterTabProps = {
  stats: RaffleStats;
  chainId: number;
  countdown: number;
};

const MAX_ENTRIES = 50;

function Row({ label, value, hint }: { label: ReactNode; value: ReactNode; hint?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-uni-muted">{label}</span>
      <span className={`tnum font-semibold ${hint ? "text-uni-muted" : ""}`}>{value}</span>
    </div>
  );
}

export function EnterTab({ stats, chainId, countdown }: EnterTabProps) {
  const [entries, setEntries] = useState(1);
  const { address, isConnected, chainId: walletChainId } = useAccount();
  const { openConnect } = useWalletUI();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: balance } = useBalance({ address, chainId, query: { enabled: Boolean(address) } });
  const { enter, hash, isPending, isConfirming, isConfirmed, error, reset } = useEnterRaffle(
    stats.address,
    chainId,
  );

  const chain = CHAIN_META[chainId];
  const wrongNetwork = isConnected && walletChainId !== chainId;
  const fee = stats.entranceFee;
  const amount = fee !== undefined ? fee * BigInt(entries) : undefined;
  const insufficientBalance = balance !== undefined && amount !== undefined && amount > balance.value;

  const totalTickets = stats.players.length + entries;
  const potentialTickets = stats.ticketCount + entries;
  const winChance = totalTickets > 0 ? (potentialTickets / totalTickets) * 100 : 0;

  useEffect(() => {
    if (isConfirmed) setEntries(1);
  }, [isConfirmed]);

  const handlePrimary = () => {
    if (!isConnected) {
      openConnect();
      return;
    }
    if (wrongNetwork) {
      switchChain({ chainId });
      return;
    }
    if (!fee) return;
    void enter(entries, fee);
  };

  const buttonLabel = () => {
    if (!stats.configured) return "Contract not configured";
    if (!isConnected) return "Connect wallet";
    if (wrongNetwork) return `Switch to ${chain?.name ?? "network"}`;
    if (!stats.open) return "Drawing in progress…";
    if (isPending) return "Confirm in wallet…";
    if (isConfirming) return "Entering…";
    if (insufficientBalance) return "Insufficient ETH";
    if (stats.loading || fee === undefined) return "Loading…";
    return `Enter raffle · Ξ${formatEth(amount, 4)}`;
  };

  const buttonDisabled =
    !stats.configured ||
    !stats.open ||
    isPending ||
    isConfirming ||
    isSwitching ||
    insufficientBalance ||
    (!isConnected ? false : fee === undefined);

  return (
    <div className="animate-rise">
      {/* prize pool */}
      <div className="relative overflow-hidden rounded-3xl border border-fox-tint/70 bg-gradient-to-br from-[#fff5ec] via-[#fff9f4] to-[#ffeadb] p-5 dark:border-fox/20 dark:from-[#2a1c14] dark:via-[#241a15] dark:to-[#1d1510]">
        <div
          className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,138,76,0.45),transparent_65%)] blur-md"
          aria-hidden="true"
        />
        <Fox className="pointer-events-none absolute -bottom-6 right-2 h-24 w-24 rotate-[-8deg] opacity-15" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-uni-muted">
              Prize pool
              <span className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-bold text-fox-deep dark:bg-white/10 dark:text-fox-glow">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    stats.open ? "bg-[#22c55e]" : "bg-fox"
                  }`}
                />
                {stats.open ? (stats.calculating ? "Drawing" : "Live") : "Calculating"}
              </span>
            </div>
            <div className="tnum mt-1.5 text-[44px] font-extrabold leading-none tracking-[-0.04em]">
              Ξ{formatEth(stats.prizePool, 4)}
            </div>
            <div className="mt-2 text-sm text-uni-muted">
              {stats.players.length} {pluralize(stats.players.length, "ticket")} sold
            </div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fox-glow to-fox text-xl font-bold text-white shadow-fox-btn">
            Ξ
          </div>
        </div>
      </div>

      {/* entry amount */}
      <div className="mt-3 rounded-2xl border border-uni-line p-4 transition duration-300 hover:border-fox-tint dark:border-uni-darkline dark:hover:border-fox/30">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-uni-muted">Buy tickets</span>
          {balance && (
            <span className="text-xs text-uni-muted">Balance Ξ{formatEth(balance.value, 4)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="tnum text-[34px] font-bold leading-none tracking-[-0.035em]">
            {amount === undefined ? "—" : formatEth(amount, 4)}
          </div>
          <div className="flex items-center gap-1 rounded-full border border-uni-line p-1 dark:border-uni-darkline">
            <button
              type="button"
              onClick={() => setEntries((value) => Math.max(1, value - 1))}
              disabled={entries <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-fox-soft hover:text-fox-deep disabled:opacity-30 dark:hover:bg-fox/10"
              aria-label="Remove one ticket"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="tnum w-7 text-center text-sm font-bold">{entries}</span>
            <button
              type="button"
              onClick={() => setEntries((value) => Math.min(MAX_ENTRIES, value + 1))}
              disabled={entries >= MAX_ENTRIES}
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-fox-soft hover:text-fox-deep disabled:opacity-30 dark:hover:bg-fox/10"
              aria-label="Add one ticket"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-cream-deep px-2.5 py-1.5 text-sm font-semibold dark:bg-[#28231f]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-fox-glow to-fox text-[11px] text-white">
              Ξ
            </span>
            ETH
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-uni-muted">
          <span>
            {entries} × Ξ{formatEth(fee, 4)} per ticket
          </span>
          <span className="flex items-center gap-1">
            <Ticket className="h-3.5 w-3.5" />
            {stats.ticketCount} owned
          </span>
        </div>
      </div>

      {/* stats */}
      <div className="mt-3 rounded-2xl bg-cream px-4 py-3 dark:bg-[#28231f]">
        <Row label="Your chance" value={totalTickets > 0 ? formatPercent(winChance, 2) : "—"} />
        <Row
          label="Draw"
          value={
            !stats.open
              ? "Awaiting VRF"
              : countdown > 0
                ? `in ${formatDuration(countdown)}`
                : "Ready now"
          }
        />
        <Row label="Tickets after purchase" value={potentialTickets} hint />
      </div>

      <button
        type="button"
        onClick={handlePrimary}
        disabled={buttonDisabled}
        className="btn-primary mt-3 w-full"
      >
        <span className="sheen" />
        {(isPending || isConfirming || isSwitching) && <Spinner className="h-4 w-4 animate-spin" />}
        {buttonLabel()}
      </button>

      {insufficientBalance && isConnected && (
        <p className="mt-2 text-center text-xs text-[#d0342c]">
          You need Ξ{formatEth((amount ?? 0n) - (balance?.value ?? 0n), 4)} more to buy {entries}{" "}
          {pluralize(entries, "ticket")}.
        </p>
      )}

      {stats.calculating && (
        <p className="mt-2 text-center text-xs text-uni-muted">
          A winner is being drawn with Chainlink VRF. Entries reopen automatically.
        </p>
      )}

      {error && <p className="mt-2 text-center text-xs text-[#d0342c]">{error}</p>}

      {isConfirmed && hash && (
        <div className="mt-3 flex animate-pop-in items-center justify-between gap-2 rounded-2xl bg-[#f0fdf4] px-4 py-3 text-sm text-[#15803d] dark:bg-[#132a1c] dark:text-[#6ee7a0]">
          <span className="flex items-center gap-2 font-semibold">
            <Ticket className="h-4 w-4" />
            You're in. Good luck!
          </span>
          <span className="flex items-center gap-3">
            {explorerTxUrl(chainId, hash) && (
              <a
                href={explorerTxUrl(chainId, hash) ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-0.5 text-xs font-semibold underline-offset-2 hover:underline"
              >
                Receipt
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold underline-offset-2 hover:underline"
            >
              Dismiss
            </button>
          </span>
        </div>
      )}

      <p className="mt-3 text-center text-xs leading-relaxed text-uni-muted">
        Winners are picked on-chain with verifiable randomness. The full pot goes to one ticket.
      </p>
    </div>
  );
}
