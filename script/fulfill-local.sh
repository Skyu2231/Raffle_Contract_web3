#!/usr/bin/env bash
# Fulfil the pending draw on a local Anvil node.
#
# The mock VRF coordinator used by `make deploy-local` does not fulfil requests
# on its own. After the UI calls `performUpkeep`, run this to pick the winner.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

RPC_URL="${RPC_URL:-http://127.0.0.1:8545}"
PRIVATE_KEY="${PRIVATE_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}"

RAFFLE="${1:-${RAFFLE_ADDRESS:-}}"
if [ -z "$RAFFLE" ] && [ -f frontend/.env.local ]; then
  RAFFLE=$(grep -E '^VITE_RAFFLE_ADDRESS_31337=' frontend/.env.local | cut -d= -f2-)
fi
if [ -z "$RAFFLE" ]; then
  echo "Usage: make fulfill-local RAFFLE=<raffle address>" >&2
  exit 1
fi

STATE=$(cast call "$RAFFLE" "getRaffleState()(uint8)" --rpc-url "$RPC_URL")
if [ "$STATE" != "1" ]; then
  echo "Raffle is not waiting on a draw (state $STATE). Click \"Draw winner\" first."
  exit 0
fi

COORDINATOR=$(cast call "$RAFFLE" "s_vrfCoordinator()(address)" --rpc-url "$RPC_URL")

REQUEST_ID=$(cast logs --address "$RAFFLE" "RequestedRaffleWinner(uint256)" \
  --from-block 0 --json --rpc-url "$RPC_URL" |
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const a=JSON.parse(s);if(!a.length)process.exit(1);process.stdout.write(String(BigInt(a[a.length-1].topics[1])))})')

echo "Fulfilling request $REQUEST_ID on $COORDINATOR..."
cast send "$COORDINATOR" "fulfillRandomWords(uint256,address)" "$REQUEST_ID" "$RAFFLE" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" >/dev/null

echo "Winner: $(cast call "$RAFFLE" "getRecentWinner()(address)" --rpc-url "$RPC_URL")"
echo "Pot remaining: $(cast call "$RAFFLE" "getPrizePool()(uint256)" --rpc-url "$RPC_URL") wei"
