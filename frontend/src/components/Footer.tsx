import { ArrowUpRight, Discord, Fox, Github, XSocial } from "./icons";

const COLUMNS = [
  {
    title: "Raffle",
    links: [
      { label: "Enter", href: "#raffle" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Players", href: "#raffle" },
      { label: "Activity", href: "#raffle" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Chainlink VRF", href: "https://docs.chain.link/vrf/v2-5/overview" },
      { label: "Chainlink Automation", href: "https://docs.chain.link/chainlink-automation" },
      { label: "Foundry book", href: "https://book.getfoundry.sh/" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Source code", href: "https://github.com/Cyfrin/foundry-smart-contract-lottery-cu" },
      { label: "Contract ABI", href: "#raffle" },
      { label: "Cyfrin course", href: "https://updraft.cyfrin.io/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-uni-line bg-cream-card dark:border-uni-darkline dark:bg-[#0d0d0c]">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-14 sm:px-8">
        <div className="grid gap-10 border-b border-uni-line pb-12 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] dark:border-uni-darkline">
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <Fox className="h-8 w-8" />
              <span className="display text-[22px] leading-none">raffle</span>
            </a>
            <p className="mt-5 max-w-[300px] text-sm leading-relaxed text-uni-muted dark:text-white/45">
              A self-custodial lottery on Ethereum. One pot, one winner, verified randomness — no
              house in the middle.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { icon: XSocial, href: "https://x.com/chainlink", label: "X" },
                { icon: Discord, href: "https://discord.gg/chainlink", label: "Discord" },
                {
                  icon: Github,
                  href: "https://github.com/Cyfrin/foundry-smart-contract-lottery-cu",
                  label: "GitHub",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center border border-uni-line text-uni-muted transition duration-300 hover:-translate-y-0.5 hover:border-fox hover:bg-fox hover:text-white dark:border-uni-darkline dark:text-white/55"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-uni-muted dark:text-white/40">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className="group inline-flex items-center gap-1 text-sm text-uni-muted transition hover:text-fox dark:text-white/50 dark:hover:text-fox-glow"
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="group mt-10 flex items-end justify-between gap-4 overflow-hidden"
          aria-label="Back to top"
        >
          <span className="display block bg-gradient-to-b from-uni-ink to-uni-ink/40 bg-clip-text text-[clamp(72px,20.5vw,300px)] leading-[0.72] tracking-tightest text-transparent transition-colors duration-500 group-hover:from-fox group-hover:to-fox/50 dark:from-[#f4f1ea] dark:to-[#f4f1ea]/30 dark:group-hover:from-fox dark:group-hover:to-fox/40">
            raffle
          </span>
          <span className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-uni-line transition duration-300 group-hover:-translate-y-1 group-hover:border-fox group-hover:text-fox dark:border-uni-darkline">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </a>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-uni-line py-6 font-mono text-[9px] uppercase tracking-[0.16em] text-uni-muted sm:flex-row sm:items-center dark:border-uni-darkline dark:text-white/35">
          <span>
            Built on Chainlink VRF v2.5 + Automation · Foundry Raffle. Unaudited sample software — use
            testnets.
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            Contracts live on-chain
          </span>
        </div>
      </div>
    </footer>
  );
}
