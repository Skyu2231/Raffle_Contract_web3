import { useAccount } from "wagmi";
import { BackgroundGlow } from "./components/BackgroundGlow";
import { Banner } from "./components/Banner";
import { CtaBand } from "./components/CtaBand";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { InfoColumn } from "./components/InfoColumn";
import { Marquee } from "./components/Marquee";
import { Navbar } from "./components/Navbar";
import { RaffleCard } from "./components/RaffleCard";
import { Reveal } from "./components/Reveal";
import { ScrollProgress } from "./components/ScrollProgress";
import { Showcase } from "./components/Showcase";
import { StatsBand } from "./components/StatsBand";
import { useActivity } from "./hooks/useActivity";
import { useCountdown } from "./hooks/useCountdown";
import { useRaffle } from "./hooks/useRaffle";
import { useTheme } from "./hooks/useTheme";
import { DEFAULT_CHAIN_ID, getRaffleAddress } from "./lib/config";
import { Sparkle } from "./components/icons";

const TICKER = [
  "Provably fair draws",
  "Chainlink VRF v2.5",
  "0% house edge",
  "Instant payout",
  "Fully on-chain",
  "Self-custody",
  "Open to everyone",
];

function ConfigNotice() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-fox-tint bg-fox-soft px-4 py-3.5 text-sm text-fox-deep dark:border-fox/25 dark:bg-fox/10 dark:text-fox-glow">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fox text-white">
        !
      </span>
      <span>
        <span className="font-semibold">No raffle contract configured for this network.</span> Deploy
        with{" "}
        <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs dark:bg-white/10">
          make deploy
        </code>{" "}
        and add the address to <code className="font-mono text-xs">frontend/.env</code> as{" "}
        <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs dark:bg-white/10">
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
      <BackgroundGlow />
      <div className="noise pointer-events-none fixed inset-0 z-[5]" aria-hidden="true" />
      <ScrollProgress />
      <Banner />
      <Navbar
        theme={theme}
        onToggleTheme={toggle}
        chainId={chainId}
        contractAddress={stats.address}
      />

      <Hero stats={stats} countdown={countdown} />

      <div className="border-y border-uni-line/80 bg-white/60 py-3.5 backdrop-blur dark:border-uni-darkline dark:bg-white/[0.02]">
        <Marquee items={TICKER} />
      </div>

      <main className="relative">
        <section id="raffle" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-4 py-14 sm:px-6 lg:py-20">
          {!stats.configured && <ConfigNotice />}

          <Reveal className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">
                <Sparkle className="h-3.5 w-3.5" />
                Live raffle
              </span>
              <h2 className="mt-4 text-balance font-display text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[46px]">
                Buy a ticket. Watch the draw.
              </h2>
            </div>
            <p className="max-w-[280px] text-sm leading-relaxed text-uni-muted">
              The pot updates with every entry. When the timer hits zero, one ticket takes it all.
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

          <p className="mt-6 max-w-[640px] text-[11px] leading-relaxed text-uni-muted">
            Every transaction is final. This is unaudited sample software — use testnets and only
            spend what you can afford to lose.
          </p>
        </section>

        <StatsBand stats={stats} />
        <Showcase />
        <Features />
        <CtaBand />
      </main>

      <Footer />
    </div>
  );
}
