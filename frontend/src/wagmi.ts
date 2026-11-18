import { createConfig, http } from "wagmi";
import { foundry, mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { DEFAULT_CHAIN_ID } from "./lib/config";

const env = import.meta.env;

const chains = [sepolia, mainnet, foundry] as const;

const transports = {
  [sepolia.id]: http(env.VITE_SEPOLIA_RPC_URL || undefined),
  [mainnet.id]: http(env.VITE_MAINNET_RPC_URL || undefined),
  [foundry.id]: http(env.VITE_ANVIL_RPC_URL || "http://127.0.0.1:8545"),
};

const defaultChain = chains.find((chain) => chain.id === DEFAULT_CHAIN_ID) ?? sepolia;

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected({ shimDisconnect: true })],
  transports,
  ssr: false,
});

export { defaultChain };
