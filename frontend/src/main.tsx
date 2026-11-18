import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import App from "./App";
import { WalletUIProvider } from "./components/ConnectWallet";
import { wagmiConfig } from "./wagmi";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 4_000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletUIProvider>
          <App />
        </WalletUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
