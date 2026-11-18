import { Reveal } from "./Reveal";
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
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:py-20">
        <Reveal className="max-w-[620px]">
          <span className="tag-mono">[ 03 — how it works ]</span>
          <h2 className="mt-4 text-balance font-display text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[48px]">
            Three steps.<br className="hidden sm:block" /> Zero trust required.
          </h2>
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-uni-muted">
            A round is transparent from the first ticket to the payout. Every action lives in one
            small contract on a public chain.
          </p>
        </Reveal>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((item, index) => (
            <li key={item.step} className="list-none">
              <Reveal delay={index * 90}>
                <div className="group relative h-full overflow-hidden rounded-4xl border border-uni-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-fox-tint hover:shadow-float dark:border-uni-darkline dark:bg-uni-surface dark:shadow-card-dark dark:hover:border-fox/40">
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fox-soft opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-fox/10"
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fox-glow to-fox text-white shadow-fox-btn">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-semibold tracking-[0.2em] text-uni-muted/60">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="relative mt-5 text-lg font-bold tracking-[-0.02em]">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-uni-muted">{item.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {BENEFITS.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <div className="flex h-full items-start gap-3 rounded-3xl border border-transparent px-2 py-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fox-tint/70 bg-fox-soft text-fox-deep dark:border-fox/25 dark:bg-fox/10 dark:text-fox-glow">
                  <item.icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-uni-muted">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
