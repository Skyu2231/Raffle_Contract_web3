/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAIN_ID?: string;
  readonly VITE_RAFFLE_ADDRESS_31337?: string;
  readonly VITE_RAFFLE_ADDRESS_11155111?: string;
  readonly VITE_RAFFLE_ADDRESS_1?: string;
  readonly VITE_SEPOLIA_RPC_URL?: string;
  readonly VITE_MAINNET_RPC_URL?: string;
  readonly VITE_ANVIL_RPC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
