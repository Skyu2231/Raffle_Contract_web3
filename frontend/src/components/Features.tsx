import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";
import { Bolt, Coins, Globe, Lock, Shield, Ticket } from "./icons";

const STEPS = [
  {
    step: "01",
    icon: Ticket,
    title: "Buy a ticket",
    body: "Send the entry fee in ETH. Every ticket is a separate, equal chance at the pot — buy one or fifty.",
  },
  {
    step: "02",
    icon: Bolt,
    title: "The timer runs out",
    body: "When the interval passes, anyone can trigger the draw. Chainlink Automation usually fires it first.",
  },
  {
    step: "03",
    icon: Coins,
    title: "One ticket wins it all",
    body: "Chainlink VRF picks a random ticket and the entire balance is sent to that wallet in the same transaction.",
  },
];

const BENEFITS = [
  {
    icon: Shield,
    title: "Provably fair",
    body: "Randomness comes from Chainlink VRF v2.5 — the proof is verified on-chain, not by us.",
  },
  {
    icon: Lock,
    title: "Zero custody",
    body: "The contract holds the pot. No admin withdrawal, no house cut, no account to trust.",
  },
  {
    icon: Globe,
    title: "Open to anyone",
    body: "Any wallet, any device, no sign-up. Entries and payouts are public and verifiable.",
  },
];

export function Features() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-8 lg:py-24">
        <div className="flex items-center justify-between gap-4 border-b border-uni-line py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-uni-muted dark:border-uni-darkline dark:text-white/40">
          <span>[ 06 — how it works ]</span>
          <span className="hidden sm:inline">Mechanics / no trust required</span>
        </div>

        <Reveal className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_minmax(0,0.8fr)] lg:items-end lg:gap-14">
          <h2 className="display text-[clamp(34px,5.8vw,72px)]">
            <RevealText text="Three steps." delay={0.05} />
            <br />
            <span className="serif-accent normal-case text-fox">
              <RevealText text="Zero trust." delay={0.18} />
            </span>
          </h2>
          <p className="max-w-[380px] border-l border-uni-line pl-5 text-sm leading-relaxed text-uni-muted dark:border-uni-darkline dark:text-white/50">
            A round is transparent from the first ticket to the payout. Every action lives in one
            small contract on a public chain.
          </p>
        </Reveal>

        <ol className="mt-12 border-t border-uni-line dark:border-uni-darkline">
          {STEPS.map((item, index) => (
            <Reveal key={item.step} delay={index * 70}>
              <li className="group relative grid gap-4 border-b border-uni-line py-8 transition-colors duration-500 hover:bg-cream-deep/60 sm:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.1fr)] sm:items-start sm:gap-8 sm:px-4 dark:border-uni-darkline dark:hover:bg-white/[0.03]">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-uni-muted dark:text-white/40">
                  <span className="h-1.5 w-1.5 rotate-45 bg-fox opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {item.step}
                </div>
                <h3 className="display text-[clamp(26px,3.4vw,42px)] leading-[0.92] transition-colors duration-300 group-hover:text-fox">
                  {item.title}
                </h3>
                <div className="flex items-start justify-between gap-6">
                  <p className="max-w-[420px] text-sm leading-relaxed text-uni-muted dark:text-white/50">
                    {item.body}
                  </p>
                  <span className="hidden h-11 w-11 shrink-0 items-center justify-center border border-uni-line text-uni-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:border-fox group-hover:text-fox sm:flex dark:border-uni-darkline dark:text-white/40">
                    <item.icon className="h-[18px] w-[18px]" />
                  </span>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {BENEFITS.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="group">
                <div className="flex h-11 w-11 items-center justify-center border border-uni-line text-fox transition-colors duration-300 group-hover:border-fox group-hover:bg-fox group-hover:text-white dark:border-uni-darkline">
                  <item.icon className="h-[18px] w-[18px]" />
                </div>
                <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-[0.06em]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-uni-muted dark:text-white/50">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
