# Raffle — web app

The frontend for the Foundry `Raffle` contract in this repo (`../src/Raffle.sol`).
It is a MetaMask-inspired, orange-and-white single page: a hero with floating cards, a live
raffle panel for buying tickets, plus prize pool, countdown, player list and on-chain activity.

## Features

- **Enter the raffle** — buy 1–50 tickets in a single transaction (`enterRaffle(uint256)`),
  with the ETH total, your odds and the draw countdown updating live.
- **Wallet connect** — EIP-6963 wallet discovery (MetaMask, Rabby, Coinbase Wallet, …),
  account menu with balance, copy address and disconnect.
- **Live state** — reads are polled every 5s and invalidated the moment a `RaffleEnter`
  or `WinnerPicked` event is seen.
- **Players** — every ticket, grouped per wallet, with your own tickets highlighted.
- **Activity** — recent entries and winners rebuilt from contract logs, with tx links.
- **Draw winner** — when the interval has passed, the draw button appears and calls
  `performUpkeep`.
- **Product UI** — a live app-window mockup in the hero and a three-screen showcase
  (buy / draw / verify) built from real round data, with pointer-tracked 3D tilt and glare.
- **Motion** — announcement strip, drifting gradient orbs, marquee and binary tickers,
  floating cards, scroll progress bar, orbiting gradient edges, animated counters,
  scroll-reveal sections and hover sweeps, all disabled under `prefers-reduced-motion`.
- Light/dark theme, responsive layout, Sepolia / Anvil / Ethereum support via env config.

## Stack

Vite · React · TypeScript · Tailwind CSS · wagmi v2 · viem · TanStack Query.

Typography follows Chainlink's brand pairing: **TASA Orbiter** for display headings,
**Inter** for UI text and **Inconsolata** for monospace tags/labels (loaded from Google Fonts).

## Quickstart

From this `frontend/` directory:

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

## Local flow (Anvil)

In one terminal, from the repo root:

```bash
make anvil
```

In another, from the repo root:

```bash
make deploy
```

The deploy script prints:

```
Raffle deployed at: 0x...
Chain ID: 31337
```

Put that address in `frontend/.env`:

```bash
VITE_CHAIN_ID=31337
VITE_RAFFLE_ADDRESS_31337=0x...
```

Restart `npm run dev`, connect the Anvil account to your wallet
(`RPC http://127.0.0.1:8545`, chain id `31337`), and enter the raffle. The local deployment
ships with a mock VRF coordinator, so after the 30s interval you can hit **Draw winner**
yourself.

## Sepolia

From the repo root:

```bash
make deploy ARGS="--network sepolia"
```

Copy the printed address into `frontend/.env`:

```bash
VITE_CHAIN_ID=11155111
VITE_RAFFLE_ADDRESS_11155111=0x...
```

Register a Chainlink Automation upkeep on the contract (see the Foundry README) so draws
happen without a manual click.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_CHAIN_ID` | Chain read by the UI when no wallet is connected (default `11155111`) |
| `VITE_RAFFLE_ADDRESS_11155111` | Raffle address on Sepolia |
| `VITE_RAFFLE_ADDRESS_31337` | Raffle address on Anvil |
| `VITE_RAFFLE_ADDRESS_1` | Raffle address on Ethereum mainnet |
| `VITE_SEPOLIA_RPC_URL` / `VITE_MAINNET_RPC_URL` | Optional RPC overrides |
| `VITE_ANVIL_RPC_URL` | Local RPC (default `http://127.0.0.1:8545`) |

If the connected wallet is on a chain with a configured contract, the app follows that
chain; otherwise it reads from `VITE_CHAIN_ID` and offers a network switch before writing.

## Contract additions

The contract in `../src/Raffle.sol` was extended with
view helpers and multi-ticket support the UI needs:

- `enterRaffle(uint256 numberOfEntries)` — buy several tickets at once;
  `enterRaffle()` still buys one.
- `getPlayers()` — full ticket list (one entry per ticket).
- `getPrizePool()` — ETH waiting to be won.
- `getTimeRemaining()` — seconds until the next draw is allowed.
- `isRaffleOpen()` — whether entries are accepted.

## Scripts

```bash
npm run dev        # dev server
npm run typecheck  # TypeScript only
npm run build      # typecheck + production bundle in dist/
npm run preview    # serve the built bundle
```

## Layout

```
src/
  components/     banner, navbar, hero, app preview, showcase, marquee, stats,
                  features, CTA, footer, raffle card tabs, info sidebar, wallet modal,
                  reveal wrapper, tilt, count-up, scroll progress, tracking fox
  hooks/          raffle reads, contract writes, activity logs, countdown, theme
  lib/            ABI, deployment config, formatting, error helpers
  wagmi.ts        chain + connector config
  App.tsx         page composition
```

Brand tokens live in `tailwind.config.js` (`fox.*` for the orange accent, `cream.*` for the
warm canvas, `uni.*` for text/lines). Shared button, surface and reveal styles are in
`src/index.css`.
