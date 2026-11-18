import { formatEther } from "viem";

/** 0x1234…abcd */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}

/** Format wei as ETH with a fixed number of decimals, trimming trailing zeros. */
export function formatEth(wei: bigint | undefined, decimals = 4): string {
  if (wei === undefined) return "0";
  const raw = formatEther(wei);
  const [whole, fraction = ""] = raw.split(".");
  const clipped = fraction.slice(0, decimals).replace(/0+$/, "");
  const wholeFormatted = Number(whole).toLocaleString("en-US");
  return clipped ? `${wholeFormatted}.${clipped}` : wholeFormatted;
}

/** 0x1f2a → "1h 23m" / "4m 12s" / "24s" */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  if (seconds === 0) return "0s";
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function formatPercent(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "0%";
  if (value > 0 && value < 0.01) return "<0.01%";
  return `${value.toFixed(decimals).replace(/\.?0+$/, "")}%`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}
