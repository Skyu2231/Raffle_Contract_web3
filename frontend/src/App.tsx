import { useAccount } from "wagmi";
import { Banner } from "./components/Banner";
import { CtaBand } from "./components/CtaBand";
import { Cursor } from "./components/Cursor";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { InfoColumn } from "./components/InfoColumn";
import { Manifesto } from "./components/Manifesto";
import { Navbar } from "./components/Navbar";
import { Preloader } from "./components/Preloader";
import { RaffleCard } from "./components/RaffleCard";
import { RaffleTransition } from "./components/RaffleTransition";
import { Reveal } from "./components/Reveal";
import { RevealText } from "./components/RevealText";
import { ScrollProgress } from "./components/ScrollProgress";
import { ScrollTicker } from "./components/ScrollTicker";
import { Showcase } from "./components/Showcase";
import { SmoothScroll } from "./components/SmoothScroll";
import { StatsBand } from "./components/StatsBand";
import { useActivity } from "./hooks/useActivity";
import { useCountdown } from "./hooks/useCountdown";
import { useRaffle } from "./hooks/useRaffle";
import { useTheme } from "./hooks/useTheme";
import { CHAIN_META, DEFAULT_CHAIN_ID, getRaffleAddress } from "./lib/config";
import { Sparkle } from "./components/icons";

const TICKER = ["Provably fair", "0% house edge", "Instant payout", "Fully on-chain"];

function ConfigNotice() {
  return (
    <div className="mb-8 flex items-start gap-3 border border-fox-tint bg-fox-soft px-4 py-3.5 text-sm text-fox-deep dark:border-fox/25 dark:bg-fox/10 dark:text-fox-glow">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-fox font-mono text-[11px] font-bold text-white">
        !
      </span>
      <span>
        <span className="font-semibold">No raffle contract configured for this network.</span> Deploy
        with{" "}
        <code className="rounded-sm bg-white/70 px-1 py-0.5 font-mono text-xs dark:bg-white/10">
          make deploy
        </code>{" "}
        and add the address to <code className="font-mono text-xs">frontend/.env</code> as{" "}
        <code className="rounded-sm bg-white/70 px-1 py-0.5 font-mono text-xs dark:bg-white/10">
          VITE_RAFFLE_ADDRESS_11155111
        </code>
        .
      </span>
    </div>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const { chainId: walletChainId } = useAccount();

  const chainId = getRaffleAddress(walletChainId) ? walletChainId! : DEFAULT_CHAIN_ID;
  const stats = useRaffle(chainId);
  const activity = useActivity(chainId, stats.address);
  const countdown = useCountdown(stats.timeRemaining);

  return (
    <div className="relative min-h-screen">
      <SmoothScroll />
      <Preloader />
      <RaffleTransition />
      <Cursor />
      <div className="noise pointer-events-none fixed inset-0 z-[5]" aria-hidden="true" />
      <ScrollProgress />
      <Banner />
      <Navbar
        theme={theme}
        onToggleTheme={toggle}
        chainId={chainId}
        contractAddress={stats.address}
      />

      <Hero stats={stats} countdown={countdown} theme={theme} />

      <div className="overflow-hidden border-b border-uni-line bg-bone py-4 dark:border-uni-darkline dark:bg-void sm:py-6">
        <ScrollTicker items={TICKER} />
      </div>

      <main className="relative">
        <section id="raffle" className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-4 py-14 sm:px-8 lg:py-20">
          <div className="mb-9 flex items-center justify-between gap-4 border-b border-uni-line py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-uni-muted dark:border-uni-darkline dark:text-white/40">
            <span className="flex items-center gap-2">
              <Sparkle className="h-3 w-3 text-fox" />
              [ 02 — live raffle ]
            </span>
            <span>{CHAIN_META[chainId]?.name ?? "Unknown network"} / entry open</span>
          </div>

          {!stats.configured && <ConfigNotice />}

          <Reveal className="mb-10 grid gap-6 lg:grid-cols-[1.4fr_minmax(0,0.85fr)] lg:items-end lg:gap-12">
            <h2 className="display text-[clamp(34px,5.6vw,66px)]">
              <RevealText text="Buy a ticket." delay={0.05} />
              <br />
              <span className="serif-accent normal-case text-fox">
                <RevealText text="Watch the draw." delay={0.18} />
              </span>
            </h2>
            <p className="max-w-[340px] border-l border-uni-line pl-5 text-sm leading-relaxed text-uni-muted dark:border-uni-darkline dark:text-white/50">
              The pot updates with every entry. When the timer hits zero, one ticket takes it all —
              verified by Chainlink, not by us.
            </p>
          </Reveal>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
            <Reveal>
              <RaffleCard
                stats={stats}
                chainId={chainId}
                countdown={countdown}
                activity={activity.items}
                activityLoading={activity.loading}
              />
            </Reveal>

            <aside className="lg:sticky lg:top-[96px]">
              <Reveal delay={90}>
                <InfoColumn stats={stats} chainId={chainId} countdown={countdown} />
              </Reveal>
            </aside>
          </div>

          <p className="mt-7 max-w-[640px] border-l border-uni-line pl-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-uni-muted dark:border-uni-darkline dark:text-white/35">
            Every transaction is final. This is unaudited sample software — use testnets and only
            spend what you can afford to lose.
          </p>
        </section>

        <StatsBand stats={stats} />
        <Showcase />
        <Manifesto />
        <Features />
        <CtaBand />
      </main>

      <Footer />
    </div>
  );
}
