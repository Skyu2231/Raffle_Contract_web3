type Errorish = {
  shortMessage?: string;
  message?: string;
  cause?: { shortMessage?: string; message?: string };
};

/** Human-readable message for wallet / RPC / revert errors. */
export function extractError(error: unknown): string {
  if (!error) return "Transaction failed";
  if (typeof error === "string") return error;
  const err = error as Errorish;
  const message = err.shortMessage ?? err.cause?.shortMessage ?? err.message ?? err.cause?.message;
  if (!message) return "Transaction failed";
  return message.split("\n")[0].slice(0, 160);
}
