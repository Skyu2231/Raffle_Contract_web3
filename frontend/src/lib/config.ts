import { foundry, mainnet, sepolia } from "wagmi/chains";

export type SupportedChainId = typeof foundry.id | typeof sepolia.id | typeof mainnet.id;

const env = import.meta.env;

/**
 * Deployed Raffle contract addresses, keyed by chain id.
 * Set them in `.env` (see `.env.example`).
 */
export const RAFFLE_ADDRESSES: Record<number, `0x${string}` | undefined> = {
  [foundry.id]: env.VITE_RAFFLE_ADDRESS_31337 as `0x${string}` | undefined,
  [sepolia.id]: env.VITE_RAFFLE_ADDRESS_11155111 as `0x${string}` | undefined,
  [mainnet.id]: env.VITE_RAFFLE_ADDRESS_1 as `0x${string}` | undefined,
};

export const DEFAULT_CHAIN_ID = Number(env.VITE_CHAIN_ID ?? sepolia.id);

export function getRaffleAddress(chainId: number | undefined): `0x${string}` | undefined {
  if (!chainId) return undefined;
  const address = RAFFLE_ADDRESSES[chainId];
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    return undefined;
  }
  return address;
}

export const CHAIN_META: Record<
  number,
  { name: string; shortName: string; explorer: string; accent: string }
> = {
  [foundry.id]: {
    name: "Anvil",
    shortName: "Anvil",
    explorer: "",
    accent: "#ff9f43",
  },
  [sepolia.id]: {
    name: "Sepolia",
    shortName: "Sepolia",
    explorer: "https://sepolia.etherscan.io",
    accent: "#cfb5f0",
  },
  [mainnet.id]: {
    name: "Ethereum",
    shortName: "Ethereum",
    explorer: "https://etherscan.io",
    accent: "#627eea",
  },
};

export function explorerAddressUrl(chainId: number | undefined, address: string): string | null {
  if (!chainId) return null;
  const base = CHAIN_META[chainId]?.explorer;
  return base ? `${base}/address/${address}` : null;
}

export function explorerTxUrl(chainId: number | undefined, hash: string): string | null {
  if (!chainId) return null;
  const base = CHAIN_META[chainId]?.explorer;
  return base ? `${base}/tx/${hash}` : null;
}
