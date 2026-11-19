# Raffle Web3 — Smart Contract Lottery

A decentralized raffle: users pay a fixed entrance fee to enter, Chainlink VRF picks a
provably random winner, and Chainlink Automation triggers the draw once the interval has
passed. The contract is written in Solidity with Foundry, and a React + wagmi frontend in
[`./frontend`](./frontend) drives it from the browser through MetaMask.

- **Entrance fee:** `0.01 ETH`
- **Draw interval:** `30s` (configurable in `script/HelperConfig.s.sol`)
- **Randomness:** Chainlink VRF v2.5
- **Automation:** Chainlink Automation (`checkUpkeep` / `performUpkeep`)

## Contents

- [Repository layout](#repository-layout)
- [Requirements](#requirements)
- [Quickstart](#quickstart)
- [Local development (no faucet needed)](#local-development-no-faucet-needed)
- [Deploy to Sepolia](#deploy-to-sepolia)
- [Testing](#testing)
- [Scripts and helpers](#scripts-and-helpers)
- [Formatting and gas snapshots](#formatting-and-gas-snapshots)
- [Web app](#web-app)

## Repository layout

```
src/Raffle.sol              The raffle contract
src/mocks/                  Mock VRF coordinator and LINK token for local runs
script/HelperConfig.s.sol   Per-network config (fee, interval, VRF coordinator, subscription)
script/DeployRaffle.s.sol   Deploy script (used by `make deploy`)
script/deploy-local.sh      Local Anvil deploy: mock VRF + subscription + raffle
script/fulfill-local.sh     Fulfils a pending local draw (the mock does not auto-fulfil)
test/                       Unit and forked tests
frontend/                   React + wagmi web app
```

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) — `git --version`
- [foundry](https://getfoundry.sh/) — `forge --version`
- [Node.js](https://nodejs.org/) 18+ (only for the frontend)

## Quickstart

```bash
git clone git@github.com:Skyu2231/Raffle_Contract_web.git
cd Raffle_Contract_web
git submodule update --init --recursive
forge build
```

`lib/` is committed as git submodules (`forge-std`, `solmate`, `chainlink-brownie-contracts`,
`foundry-devops`), so the `git submodule update` step above is required after cloning.

## Local development (no faucet needed)

Everything runs on a local Anvil chain with mock VRF, so you get test ETH by importing an
Anvil account into MetaMask. No faucet, no real funds.

```bash
make anvil          # terminal 1: local chain on http://127.0.0.1:8545 (chain id 31337)
make deploy-local   # terminal 2: mock VRF + LINK, subscription, raffle
make fulfill-local  # terminal 3: fulfil a pending draw after you click Draw
```

`make deploy-local` writes `frontend/.env.local` with the deployed address, so the web app
picks it up with no manual editing. Anvil's default mnemonic
(`test test test ... junk`) gives ten funded accounts; import one into MetaMask with network
`http://127.0.0.1:8545`, chain id `31337` and you can buy tickets immediately.

Two local quirks worth knowing:

- The mock VRF coordinator is larger than the EIP-170 contract size limit, so `make anvil`
  starts the chain with `--disable-code-size-limit`.
- The mock does not auto-fulfil randomness. After a draw is requested, run
  `make fulfill-local` to pick the winner.

## Deploy to Sepolia

1. Set your environment variables in a `.env` file at the repo root (create it yourself —
   it is git-ignored):

   - `PRIVATE_KEY` — the deployer key. **Use a key with no real funds.**
   - `SEPOLIA_RPC_URL` — free endpoints from [Alchemy](https://alchemy.com/) or Infura.
   - `ETHERSCAN_API_KEY` — optional, only for contract verification.
   - `DEPLOYER_ADDRESS` — optional, the wallet that owns the VRF subscription (defaults to
     the deployer).
   - `VRF_SUBSCRIPTION_ID` — optional, an existing VRF v2.5 subscription id.

2. Get free Sepolia ETH and test LINK from the [Chainlink faucet](https://faucets.chain.link/sepolia).

3. Create a VRF v2.5 subscription at [vrf.chain.link/sepolia](https://vrf.chain.link/sepolia),
   fund it with LINK, and put its id in `VRF_SUBSCRIPTION_ID`. Without that variable the
   deploy script creates the subscription itself.

4. Deploy:

   ```bash
   make deploy ARGS="--network sepolia"
   ```

5. Register an Automation upkeep at [automation.chain.link](https://automation.chain.link/new)
   using **Custom logic** with the raffle address as the target, so the draw fires on its own.

On a real testnet, VRF fulfils automatically — there is no `fulfill-local` step.

## Testing

```bash
forge test                       # unit tests
forge test --fork-url $SEPOLIA_RPC_URL   # forked tests
forge coverage
```

## Scripts and helpers

```bash
make help                                   # list every target
make createSubscription ARGS="--network sepolia"
make addConsumer ARGS="--network sepolia"
make fundSubscription ARGS="--network sepolia"
```

Enter a raffle from the CLI:

```bash
cast send <RAFFLE_ADDRESS> "enterRaffle()" --value 0.01ether \
  --private-key $PRIVATE_KEY --rpc-url $SEPOLIA_RPC_URL
```

## Formatting and gas snapshots

```bash
forge fmt        # format
forge snapshot   # writes .gas-snapshot
```

## Web app

The frontend in [`./frontend`](./frontend) is a full MetaMask-oriented interface: connect
wallet, enter the raffle, live prize pool, players list, countdown, activity feed, and the
Draw button. It supports both the local Anvil chain and Sepolia.

```bash
cd frontend
npm install
npm run dev
```

See [`frontend/README.md`](./frontend/README.md) for configuration details.

## Credits

Built as a learning project following the
[Cyfrin Foundry Solidity course](https://github.com/Cyfrin/foundry-smart-contract-lottery-cu)
by Patrick Collins. `chainlink-brownie-contracts` is the official Chainlink-maintained
Foundry packaging of `@chainlink/contracts`, released through the standard Chainlink
release process.
