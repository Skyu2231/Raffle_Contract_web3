import type { RaffleStats } from "../hooks/useRaffle";
import { AppPreview } from "./AppPreview";
import { ArrowDown, Check, Sparkle } from "./icons";

type HeroProps = {
  stats: RaffleStats;
  countdown: number;
};

const TRUST = ["0% house edge", "Instant payout", "Self-custody"];

export function Hero({ stats, countdown }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 grid-lines opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
        <div className="absolute left-1/2 top-[-220px] h-[560px] w-[880px] -translate-x-1/2 animate-drift rounded-full bg-[radial-gradient(circle,rgba(255,138,76,0.34),transparent_65%)] blur-2xl" />
        <div
          className="absolute right-[6%] top-[38%] h-[260px] w-[260px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(255,196,150,0.35),transparent_65%)] blur-2xl"
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-4 pb-6 pt-12 sm:px-6 sm:pt-16 lg:pb-12">
        <div className="relative mx-auto max-w-[900px] text-center">
          <div className="flex animate-rise justify-center">
            <span className="eyebrow font-mono uppercase tracking-[0.1em]">
              <Sparkle className="h-3.5 w-3.5" />
              [ live — on-chain raffle ]
            </span>
          </div>

          <h1
            className="mt-6 animate-rise text-balance font-display text-[46px] font-extrabold uppercase leading-[0.88] tracking-[-0.035em] sm:text-[76px] lg:text-[92px]"
            style={{ animationDelay: "60ms" }}
          >
            One ticket.
            <br />
            <span className="fox-gradient-text">The whole pot.</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-[560px] animate-rise text-balance text-[15px] leading-relaxed text-uni-muted sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Buy entries in ETH, watch the timer, and let Chainlink VRF hand the entire prize pool to
            one lucky ticket. No house edge, no custody.
          </p>

          <div
            className="mt-8 flex animate-rise flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "180ms" }}
          >
            <a href="#raffle" className="btn-primary w-full sm:w-auto">
              <span className="sheen" />
              Enter the raffle
              <ArrowDown className="h-4 w-4" />
            </a>
            <a href="#how-it-works" className="btn-outline w-full sm:w-auto">
              How it works
            </a>
          </div>

          <div
            className="mt-6 flex animate-rise flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-uni-muted"
            style={{ animationDelay: "240ms" }}
          >
            {TRUST.map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-fox-soft text-fox-deep">
                  <Check className="h-2.5 w-2.5" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div
          className="relative mt-12 animate-rise sm:mt-16"
          style={{ animationDelay: "320ms" }}
        >
          <AppPreview stats={stats} countdown={countdown} />
        </div>
      </div>

    </section>
  );
}
