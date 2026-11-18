import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import type { Connector } from "wagmi";
import { explorerAddressUrl } from "../lib/config";
import { formatEth, truncateAddress } from "../lib/format";
import { Avatar } from "./Avatar";
import { Check, ChevronDown, Close, Copy, Spinner, Wallet } from "./icons";

/* -------------------------------------------------------------------------- */
/*                          shared "open connect" state                       */
/* -------------------------------------------------------------------------- */

type WalletUIContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openConnect: () => void;
};

const WalletUIContext = createContext<WalletUIContextValue | null>(null);

export function WalletUIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({ open, setOpen, openConnect: () => setOpen(true) }),
    [open],
  );
  return <WalletUIContext.Provider value={value}>{children}</WalletUIContext.Provider>;
}

export function useWalletUI(): WalletUIContextValue {
  const context = useContext(WalletUIContext);
  if (!context) throw new Error("useWalletUI must be used inside WalletUIProvider");
  return context;
}

/* -------------------------------------------------------------------------- */
/*                                  connect UI                                */
/* -------------------------------------------------------------------------- */

function connectorBlurb(connector: Connector): string {
  if (connector.type === "injected") return "Browser extension";
  if (connector.id.includes("coinbase")) return "Smart wallet";
  if (connector.id.includes("walletconnect")) return "Scan with your phone";
  return "Connect";
}

export function ConnectWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { open, setOpen } = useWalletUI();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: balance } = useBalance({ address, query: { enabled: Boolean(address) } });

  const wallets = useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((connector) => {
      const key = `${connector.id}-${connector.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [connectors]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const handleConnect = async (connector: Connector) => {
    setError(null);
    setPendingId(connector.id);
    try {
      await connectAsync({ connector });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message.split("\n")[0] : "Could not connect");
    } finally {
      setPendingId(null);
    }
  };

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_400);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {isConnected && address ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex items-center gap-2 rounded-full border border-uni-line bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold transition hover:bg-cream dark:border-uni-darkline dark:bg-uni-surface dark:hover:bg-white/5"
          >
            <Avatar address={address} size={26} />
            <span className="tnum hidden sm:inline">{truncateAddress(address, 4)}</span>
            <ChevronDown className="h-4 w-4 text-uni-muted" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 z-40 mt-2 w-64 animate-rise rounded-2xl border border-uni-line bg-white p-2 shadow-card dark:border-uni-darkline dark:bg-uni-surface dark:shadow-card-dark">
                <div className="flex items-center gap-2 rounded-xl px-2 py-2">
                  <Avatar address={address} size={32} />
                  <div className="min-w-0">
                    <div className="tnum text-sm font-semibold">{truncateAddress(address, 6)}</div>
                    <div className="text-xs text-uni-muted">
                      {balance ? `${formatEth(balance.value, 4)} ${balance.symbol}` : " "}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium transition hover:bg-cream dark:hover:bg-white/5"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy address"}
                </button>
                {explorerAddressUrl(chainId, address) && (
                  <a
                    href={explorerAddressUrl(chainId, address) ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium transition hover:bg-cream dark:hover:bg-white/5"
                  >
                    <Wallet className="h-4 w-4" />
                    View on explorer
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    disconnect();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-[#ff5c5c] transition hover:bg-[#fff5f5] dark:hover:bg-white/5"
                >
                  Disconnect
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary px-5 py-2.5 text-sm"
        >
          <span className="sheen" />
          Connect wallet
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-[420px] animate-rise overflow-hidden rounded-4xl border border-uni-line bg-white shadow-2xl dark:border-uni-darkline dark:bg-uni-surface">
            <div className="flex items-center justify-between px-5 pt-5">
              <h2 className="text-lg font-semibold">Connect a wallet</h2>
              <button type="button" className="icon-btn h-8 w-8" onClick={() => setOpen(false)} aria-label="Close">
                <Close className="h-4 w-4" />
              </button>
            </div>
            <p className="px-5 pt-1 text-sm text-uni-muted">
              Connect to buy tickets and claim your chance at the pot.
            </p>

            <div className="mt-4 max-h-[320px] space-y-1 overflow-y-auto p-3">
              {wallets.length === 0 && (
                <div className="rounded-2xl bg-cream p-4 text-sm text-uni-muted dark:bg-[#28231f]">
                  No wallet detected. Install MetaMask, Rabby or another browser wallet, then reload.
                </div>
              )}
              {wallets.map((connector) => (
                <button
                  key={`${connector.id}-${connector.name}`}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleConnect(connector)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-cream disabled:opacity-60 dark:hover:bg-white/5"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fox-glow to-fox text-sm font-bold text-white">
                    {connector.name.slice(0, 1)}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{connector.name}</span>
                    <span className="block text-xs text-uni-muted">{connectorBlurb(connector)}</span>
                  </span>
                  {pendingId === connector.id && <Spinner className="h-5 w-5 animate-spin text-uni-muted" />}
                </button>
              ))}
            </div>

            {error && (
              <p className="px-5 pb-3 text-sm text-[#ff5c5c]">
                {error.length > 120 ? `${error.slice(0, 120)}…` : error}
              </p>
            )}

            <div className="border-t border-uni-line px-5 py-4 text-xs leading-relaxed text-uni-muted dark:border-uni-darkline">
              By connecting you accept the risks of using experimental software. This raffle runs on a public
              testnet by default.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
