import { LiquidBackdrop } from "./LiquidBackdrop";
import { Magnetic } from "./Magnetic";
import { ScrambleText } from "./ScrambleText";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";
import { VelocityMarquee } from "./VelocityMarquee";
import { ArrowUpRight, Sparkle } from "./icons";

const RIBBON = ["Provably fair", "0% house edge", "Instant payout", "Fully on-chain", "VRF v2.5"];

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#080605] text-white">
      <LiquidBackdrop className="absolute inset-0 block h-full w-full" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,3,2,0.28)_0%,rgba(4,3,2,0.62)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-[0.07] [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_80%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[4vw] -top-[6vw] hidden h-[26vw] w-[26vw] animate-orbit-slow rounded-full border border-dashed border-white/20 lg:block"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-14 pt-14 sm:px-8 lg:pb-20 lg:pt-20">
        <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-4 font-mono text-[9px] uppercase tracking-[0.22em] text-white/65">
          <span className="flex items-center gap-2">
            <Sparkle className="h-3 w-3 text-fox-glow" />
            [ 07 — enter ]
          </span>
          <span className="hidden sm:inline">The next draw is already counting down</span>
        </div>

        <Reveal className="pt-10 lg:pt-14">
          <h2 className="display text-[clamp(48px,10.5vw,168px)] leading-[0.82] [text-shadow:0_12px_60px_rgba(0,0,0,0.45)]">
            <RevealText text="Your ticket" delay={0.05} />
            <br />
            <span className="serif-accent normal-case text-fox-glow">
              <RevealText text="to the pot." delay={0.2} />
            </span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 lg:grid-cols-[1.2fr_auto] lg:items-end">
          <p className="max-w-[440px] text-[15px] leading-relaxed text-white/80">
            Connect a wallet, pick your tickets, and wait for the draw. No account, no custody, no
            house cut — the next winner could be you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Magnetic strength={12}>
              <a
                href="#raffle"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-[4px] bg-bone px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-uni-ink transition duration-300 hover:-translate-y-0.5 hover:bg-white sm:w-auto"
              >
                <ScrambleText text="Enter the raffle" />
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Magnetic>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-white/45 px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto"
            >
              <ScrambleText text="Read the rules" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/20 py-4">
        <VelocityMarquee items={RIBBON} className="mask-fade-x text-white/85" />
      </div>
    </section>
  );
}
