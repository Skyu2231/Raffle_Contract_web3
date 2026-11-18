export const raffleAbi = [
  /* errors */
  {
    type: "error",
    name: "Raffle__InvalidNumberOfEntries",
    inputs: [],
  },
  {
    type: "error",
    name: "Raffle__RaffleNotOpen",
    inputs: [],
  },
  {
    type: "error",
    name: "Raffle__SendMoreToEnterRaffle",
    inputs: [],
  },
  {
    type: "error",
    name: "Raffle__TransferFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "Raffle__UpkeepNotNeeded",
    inputs: [
      { name: "currentBalance", type: "uint256" },
      { name: "numPlayers", type: "uint256" },
      { name: "raffleState", type: "uint256" },
    ],
  },
  /* events */
  {
    type: "event",
    name: "RaffleEnter",
    inputs: [{ name: "player", type: "address", indexed: true }],
  },
  {
    type: "event",
    name: "WinnerPicked",
    inputs: [{ name: "player", type: "address", indexed: true }],
  },
  {
    type: "event",
    name: "RequestedRaffleWinner",
    inputs: [{ name: "requestId", type: "uint256", indexed: true }],
  },
  /* writes */
  {
    type: "function",
    name: "enterRaffle",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "enterRaffle",
    inputs: [{ name: "numberOfEntries", type: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "performUpkeep",
    inputs: [{ name: "performData", type: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  /* reads */
  {
    type: "function",
    name: "getRaffleState",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isRaffleOpen",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEntranceFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPrizePool",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNumberOfPlayers",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPlayers",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPlayer",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRecentWinner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLastTimeStamp",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getInterval",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTimeRemaining",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNumWords",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRequestConfirmations",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "checkUpkeep",
    inputs: [{ name: "checkData", type: "bytes" }],
    outputs: [
      { name: "upkeepNeeded", type: "bool" },
      { name: "performData", type: "bytes" },
    ],
    stateMutability: "view",
  },
] as const;

export type RaffleAbi = typeof raffleAbi;
