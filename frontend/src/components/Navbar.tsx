import { useEffect, useState } from "react";
import { CHAIN_META, explorerAddressUrl } from "../lib/config";
import { ConnectWallet } from "./ConnectWallet";
import { TrackingFox } from "./TrackingFox";
import { ArrowUpRight, Close, Menu, Moon, Sun } from "./icons";

type NavbarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  chainId: number;
  contractAddress?: `0x${string}`;
};

export function Navbar({ theme, onToggleTheme, chainId, contractAddress }: NavbarProps) {
  const chain = CHAIN_META[chainId];
  const explorer = contractAddress ? explorerAddressUrl(chainId, contractAddress) : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Raffle", href: "#raffle" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Docs", href: "https://docs.chain.link/vrf/v2-5/overview", external: true },
    ...(explorer ? [{ label: "Explorer", href: explorer, external: true }] : []),
  ];

  return (
    <header
      className={`sticky top-0 z-40 bg-cream/85 backdrop-blur-xl transition-shadow duration-300 dark:bg-[#12100e]/85 ${
        scrolled
          ? "border-b border-uni-line shadow-[0_8px_30px_-24px_rgba(23,19,16,0.5)] dark:border-uni-darkline"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[76px] w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <a href="#" className="group flex items-center gap-2.5">
            <TrackingFox className="h-9 w-9 transition duration-300 group-hover:-rotate-6 group-hover:scale-105" />
            <span className="font-display text-[21px] font-extrabold uppercase tracking-[-0.01em]">raffle</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="group relative flex items-center gap-0.5 rounded-full px-3.5 py-2 text-sm font-semibold text-uni-muted transition hover:text-uni-ink dark:hover:text-white"
              >
                {link.label}
                {link.external && (
                  <ArrowUpRight className="h-3 w-3 opacity-60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                )}
                <span className="pointer-events-none absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-fox transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-uni-line bg-white/70 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:flex dark:border-uni-darkline dark:bg-white/5">
            <span
              className="relative flex h-2 w-2 rounded-full"
              style={{ background: chain?.accent ?? "#ff5c16" }}
            />
            {chain?.name ?? "Unknown"}
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            className="icon-btn"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
          <div className="hidden sm:block">
            <ConnectWallet />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="icon-btn lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <Close className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-pop-in border-t border-uni-line bg-cream px-4 pb-5 pt-2 lg:hidden dark:border-uni-darkline dark:bg-[#12100e]">
          <nav className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-uni-line/70 py-3 text-sm font-semibold last:border-0 dark:border-uni-darkline/70"
              >
                {link.label}
                {link.external && <ArrowUpRight className="h-3.5 w-3.5 text-uni-muted" />}
              </a>
            ))}
          </nav>
          <div className="mt-4 sm:hidden">
            <ConnectWallet />
          </div>
        </div>
      )}
    </header>
  );
}
