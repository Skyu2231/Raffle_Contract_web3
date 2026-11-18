import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CHAIN_META, explorerAddressUrl } from "../lib/config";
import { ConnectWallet } from "./ConnectWallet";
import { ScrambleText } from "./ScrambleText";
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
    <>
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-500 ${
        scrolled || menuOpen
          ? "border-uni-line bg-bone/85 dark:border-uni-darkline dark:bg-void/85"
          : "border-transparent bg-bone/40 dark:bg-void/40"
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8">
        <a href="#" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-uni-ink/15 transition-colors duration-300 group-hover:border-fox dark:border-white/20">
            <TrackingFox className="h-7 w-7 transition duration-500 group-hover:-rotate-12" />
          </span>
          <span className="flex flex-col">
            <span className="display text-[22px] leading-[0.8]">raffle</span>
            <span className="mt-1 hidden font-mono text-[8px] uppercase tracking-[0.28em] text-uni-muted sm:block dark:text-white/40">
              on-chain lottery
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="link-line group flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-uni-muted transition-colors hover:text-uni-ink dark:text-white/55 dark:hover:text-white"
            >
              <ScrambleText text={link.label} />
              {link.external && (
                <ArrowUpRight className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2 border border-uni-line px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-uni-muted sm:flex dark:border-uni-darkline dark:text-white/55">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: chain?.accent ?? "#ff4d00" }}
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
              <Sun className="h-[17px] w-[17px]" />
            ) : (
              <Moon className="h-[17px] w-[17px]" />
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
    </header>

    <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[72px] bottom-0 z-30 overflow-y-auto border-t border-uni-line bg-bone px-4 pb-10 pt-4 lg:hidden dark:border-uni-darkline dark:bg-void"
          >
            <nav className="flex flex-col">
              {links.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-baseline justify-between border-b border-uni-line/70 py-5 dark:border-uni-darkline/70"
                >
                  <span className="display text-[34px] leading-none transition-colors group-hover:text-fox">
                    <ScrambleText text={link.label} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-uni-muted">
                    0{index + 1}
                  </span>
                </a>
              ))}
            </nav>
            <div className="mt-6 sm:hidden">
              <ConnectWallet />
            </div>
            <p className="mt-8 max-w-[280px] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-uni-muted">
              Provable randomness, zero custody. One ticket takes the whole pot.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
