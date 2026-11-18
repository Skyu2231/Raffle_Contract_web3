import { Magnetic } from "./Magnetic";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";
import { ArrowUpRight, Sparkle } from "./icons";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-fox text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.3), transparent 42%), radial-gradient(circle at 85% 90%, rgba(90,20,0,0.45), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-[0.12]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[4vw] -top-[6vw] hidden h-[26vw] w-[26vw] animate-orbit-slow rounded-full border border-dashed border-white/25 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-14 pt-14 sm:px-8 lg:pb-20 lg:pt-20">
        <div className="flex items-center justify-between gap-4 border-b border-white/25 pb-4 font-mono text-[9px] uppercase tracking-[0.22em] text-white/70">
          <span className="flex items-center gap-2">
            <Sparkle className="h-3 w-3" />
            [ 06 — enter ]
          </span>
          <span className="hidden sm:inline">The next draw is already counting down</span>
        </div>

        <Reveal className="pt-10 lg:pt-14">
          <h2 className="display text-[clamp(48px,10.5vw,168px)] leading-[0.82]">
            <RevealText text="Your ticket" delay={0.05} />
            <br />
            <span className="serif-accent normal-case">
              <RevealText text="to the pot." delay={0.2} />
            </span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 border-t border-white/25 pt-8 lg:grid-cols-[1.2fr_auto] lg:items-end">
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
                Enter the raffle
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Magnetic>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-white/45 px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto"
            >
              Read the rules
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/25 py-3">
        <Marquee
          items={["Provably fair", "0% house edge", "Instant payout", "Fully on-chain", "VRF v2.5"]}
          inverse
          className="text-white"
          mono
        />
      </div>
    </section>
  );
}
