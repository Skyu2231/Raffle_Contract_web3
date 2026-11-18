import { Reveal } from "./Reveal";
import { TrackingFox } from "./TrackingFox";
import { ArrowRight, Fox, Sparkle } from "./icons";

export function CtaBand() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-16 sm:px-6 lg:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-[#ff7a2f] via-[#ff5c16] to-[#d94208] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 90%, rgba(120,30,0,0.35), transparent 45%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.18)_50%,transparent_65%)] bg-[length:220%_100%] animate-shimmer"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-[640px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] backdrop-blur">
              <Sparkle className="h-3.5 w-3.5" />
              on-chain raffle · open now
            </span>
            <h2 className="mt-5 text-balance font-display text-[36px] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] sm:text-[56px]">
              Your ticket to the pot.
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-balance text-[15px] leading-relaxed text-white/80">
              Connect a wallet, pick your tickets, and wait for the draw. The next winner could be
              you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#raffle"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-fox-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#fff6ef] sm:w-auto"
              >
                Enter the raffle
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-base font-semibold backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
              >
                Read the rules
              </a>
            </div>
          </div>

          <TrackingFox className="pointer-events-none absolute -bottom-8 -right-6 h-44 w-44 rotate-[-12deg] opacity-30 sm:h-56 sm:w-56" />
          <Fox className="pointer-events-none absolute -left-10 -top-8 h-32 w-32 rotate-[14deg] opacity-20 animate-floaty-slow sm:h-40 sm:w-40" />
        </div>
      </Reveal>
    </section>
  );
}
