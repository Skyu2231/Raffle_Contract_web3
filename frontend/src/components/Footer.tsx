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
    <footer className="relative border-t border-uni-line bg-white dark:border-uni-darkline dark:bg-[#16130f]">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <Fox className="h-9 w-9" />
              <span className="font-display text-[21px] font-extrabold uppercase tracking-[-0.01em]">raffle</span>
            </a>
            <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-uni-muted">
              A self-custodial lottery on Ethereum. One pot, one winner, verified randomness — no
              house in the middle.
            </p>
            <div className="mt-5 flex items-center gap-2">
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-uni-line text-uni-muted transition duration-200 hover:-translate-y-0.5 hover:border-fox-tint hover:bg-fox-soft hover:text-fox-deep dark:border-uni-darkline dark:hover:border-fox/40 dark:hover:bg-fox/10 dark:hover:text-fox-glow"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-uni-muted">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className="group inline-flex items-center gap-1 text-sm text-uni-muted transition hover:text-fox-deep dark:hover:text-fox-glow"
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

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-uni-line pt-6 text-xs text-uni-muted sm:flex-row sm:items-center dark:border-uni-darkline">
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
