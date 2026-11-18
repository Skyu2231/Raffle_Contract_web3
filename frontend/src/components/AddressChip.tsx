import { useState } from "react";
import { explorerAddressUrl } from "../lib/config";
import { truncateAddress } from "../lib/format";
import { Check, Copy } from "./icons";

type AddressChipProps = {
  address: string;
  chainId?: number;
  chars?: number;
  showCopy?: boolean;
  className?: string;
};

export function AddressChip({ address, chainId, chars = 4, showCopy = false, className = "" }: AddressChipProps) {
  const [copied, setCopied] = useState(false);
  const url = explorerAddressUrl(chainId, address);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_400);
    } catch {
      /* clipboard can be blocked; the address stays visible */
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="tnum font-medium hover:text-fox transition-colors"
        >
          {truncateAddress(address, chars)}
        </a>
      ) : (
        <span className="tnum font-medium">{truncateAddress(address, chars)}</span>
      )}
      {showCopy && (
        <button
          type="button"
          onClick={copy}
          className="text-uni-muted transition hover:text-uni-ink dark:hover:text-white"
          aria-label="Copy address"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </span>
  );
}
