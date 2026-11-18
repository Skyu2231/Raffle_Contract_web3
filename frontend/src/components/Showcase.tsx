import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";
import { Avatar } from "./Avatar";
import type { ReactNode } from "react";
import { ArrowUpRight, Bolt, Check, Shield, Ticket, Trophy } from "./icons";

const BINARY = [
  "01010010 01000001 01000110 01000110 01001100 01000101",
  "01010110 01010010 01000110 00100000 01010110 00110010",
  "01001111 01001110 00101101 01000011 01001000 01000001 01001001 01001110",
];

const WINNERS = [
  { address: "0x7a3Fb2d1C4e5A6b7C8d9E0f1A2b3C4d5E6f7A8b9", amount: "12.4821", when: "2h ago" },
  { address: "0x1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c", amount: "9.1045", when: "8h ago" },
  { address: "0x9E8d7C6b5A4f3E2d1C0b9A8f7E6d5C4b3A2f1E0d", amount: "6.7730", when: "1d ago" },
];

function BuyScreen() {
  return (
    <div className="rounded-2xl border border-uni-line bg-white p-3.5 shadow-pill dark:border-uni-darkline dark:bg-uni-surface">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.1em] text-uni-muted">
        Prize pool
        <span className="flex items-center gap-1 rounded-full bg-fox-soft px-1.5 py-0.5 text-[9px] text-fox-deep dark:bg-fox/10 dark:text-fox-glow">
          <span className="h-1 w-1 rounded-full bg-fox" />
          live
        </span>
      </div>
      <div className="tnum mt-1.5 font-display text-[26px] font-extrabold leading-none tracking-[-0.03em]">
        Ξ12.4821
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-cream px-2.5 py-2 dark:bg-white/5">
        <span className="text-[10px] font-medium text-uni-muted">Tickets</span>
        <div className="flex items-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-uni-muted shadow-sm dark:bg-white/10">
            −
          </span>
          <span className="tnum w-4 text-center text-xs font-bold">3</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-uni-muted shadow-sm dark:bg-white/10">
            +
          </span>
        </div>
      </div>
      <div className="relative mt-2.5 flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-[#ff7a2f] to-[#ef4e07] py-2 text-[11px] font-semibold text-white">
        <span className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.4)_50%,transparent_65%)] bg-[length:220%_100%]" />
        <Ticket className="h-3 w-3" />
        Enter raffle
      </div>
    </div>
  );
}

function DrawScreen() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-uni-line bg-white p-4 shadow-pill dark:border-uni-darkline dark:bg-uni-surface">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 animate-orbit rounded-full bg-[conic-gradient(from_0deg,#ff8a4c,#ff5c16_35%,rgba(255,224,204,0.15)_55%,transparent_75%)]" />
        <div className="absolute inset-[5px] flex flex-col items-center justify-center rounded-full bg-white dark:bg-uni-surface">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-uni-muted">drawing</span>
          <span className="tnum font-display text-lg font-extrabold leading-none">0:04</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 rounded-full border border-fox-tint bg-fox-soft px-2.5 py-1 text-[10px] font-semibold text-fox-deep dark:border-fox/25 dark:bg-fox/10 dark:text-fox-glow">
        <Shield className="h-3 w-3" />
        Chainlink VRF verified
      </div>
      <div className="mt-3 flex w-full items-center gap-2 rounded-xl border border-dashed border-uni-line px-2.5 py-2 dark:border-uni-darkline">
        <Avatar address={WINNERS[0].address} size={20} />
        <span className="tnum text-[10px] font-semibold">0x7a3F…A8b9</span>
        <span className="ml-auto flex items-center gap-0.5 text-[10px] font-bold text-[#15803d] dark:text-[#6ee7a0]">
          <Trophy className="h-3 w-3" />
          Ξ12.4821
        </span>
      </div>
    </div>
  );
}

function LedgerScreen() {
  return (
    <div className="overflow-hidden rounded-2xl border border-uni-line bg-white shadow-pill dark:border-uni-darkline dark:bg-uni-surface">
      {WINNERS.map((winner, index) => (
        <div
          key={winner.address}
          className={`flex items-center gap-2 px-3 py-2.5 ${
            index !== WINNERS.length - 1 ? "border-b border-uni-line/80 dark:border-uni-darkline" : ""
          }`}
        >
          <Avatar address={winner.address} size={22} />
          <div className="min-w-0 flex-1">
            <div className="tnum truncate text-[10px] font-semibold">
              {winner.address.slice(0, 6)}…{winner.address.slice(-4)}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wide text-uni-muted">
              {winner.when}
            </div>
          </div>
          <span className="tnum text-[11px] font-bold text-fox-deep dark:text-fox-glow">
            Ξ{winner.amount}
          </span>
          <Check className="h-3 w-3 text-[#22c55e]" />
        </div>
      ))}
      <div className="flex items-center justify-between bg-cream px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-uni-muted dark:bg-white/5">
        <span>on-chain ledger</span>
        <span className="flex items-center gap-1">
          <Bolt className="h-2.5 w-2.5 text-fox" />
          live
        </span>
      </div>
    </div>
  );
}

type ShowCardProps = {
  tag: string;
  title: string;
  body: string;
  delay: number;
  children: ReactNode;
};

function ShowCard({ tag, title, body, delay, children }: ShowCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <Tilt max={6} className="h-full rounded-4xl">
        <article className="bracket-card relative h-full rounded-4xl border border-uni-line bg-white p-2.5 shadow-card dark:border-uni-darkline dark:bg-uni-surface dark:shadow-card-dark">
          <div className="card-shine relative flex h-full flex-col overflow-hidden rounded-[22px] bg-gradient-to-b from-white to-cream/80 p-5 dark:from-uni-surface dark:to-[#241e19]">
            <span className="tag-mono">{tag}</span>
            <h3 className="mt-2.5 font-display text-[22px] font-bold leading-[1.1] tracking-[-0.02em]">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-uni-muted">{body}</p>
            <div className="mt-5 flex-1">{children}</div>
            <a
              href="#raffle"
              className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-uni-muted transition hover:text-fox-deep dark:hover:text-fox-glow"
            >
              open in app
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </article>
      </Tilt>
    </Reveal>
  );
}

export function Showcase() {
  return (
    <section id="app" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,224,204,0.6),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,92,22,0.08),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-[560px]">
            <span className="tag-mono">[ 02 — inside the app ]</span>
            <h2 className="mt-4 font-display text-[36px] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[52px]">
              Buy, draw, verify.
            </h2>
            <p className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-uni-muted">
              Three screens, no account, no custody. The same on-chain round rendered as a clean
              little app — because a lottery you can read is a lottery you can trust.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-wrap items-center gap-2">
              {["mobile ready", "live data", "vrf-backed"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-uni-line bg-white/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-uni-muted backdrop-blur dark:border-uni-darkline dark:bg-white/5"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <ShowCard
            tag="[ 01 — buy ]"
            title="Pick your tickets"
            body="Choose 1–50 entries, see the exact ETH total and your odds before you sign."
            delay={0}
          >
            <BuyScreen />
          </ShowCard>
          <ShowCard
            tag="[ 02 — draw ]"
            title="Watch it settle"
            body="The ring winds down, Chainlink VRF picks the ticket and the pot moves in one transaction."
            delay={90}
          >
            <DrawScreen />
          </ShowCard>
          <ShowCard
            tag="[ 03 — verify ]"
            title="Check every winner"
            body="Every round is a public log — winner, amount and tx, straight from the contract."
            delay={180}
          >
            <LedgerScreen />
          </ShowCard>
        </div>

        <Reveal delay={120}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-uni-ink py-2.5">
            <Marquee items={BINARY} mono inverse />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
