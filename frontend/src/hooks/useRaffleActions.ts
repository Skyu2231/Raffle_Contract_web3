import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { raffleAbi } from "../lib/raffleAbi";
import { extractError } from "../lib/errors";

export function useEnterRaffle(address: `0x${string}` | undefined, chainId: number | undefined) {
  const [error, setError] = useState<string | null>(null);
  const { writeContractAsync, data: hash, isPending, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash, chainId });

  const enter = async (entries: number, entranceFee: bigint) => {
    if (!address) return;
    setError(null);
    try {
      const amount = entranceFee * BigInt(entries);
      return await writeContractAsync({
        address,
        abi: raffleAbi,
        functionName: "enterRaffle",
        args: [BigInt(entries)],
        value: amount,
        chainId,
      });
    } catch (err) {
      setError(extractError(err));
      return undefined;
    }
  };

  return {
    enter,
    hash,
    isPending,
    isConfirming: receipt.isLoading,
    isConfirmed: receipt.isSuccess,
    error: error ?? (receipt.error ? extractError(receipt.error) : null),
    reset: () => {
      setError(null);
      reset();
    },
  };
}

export function useDrawWinner(address: `0x${string}` | undefined, chainId: number | undefined) {
  const [error, setError] = useState<string | null>(null);
  const { writeContractAsync, data: hash, isPending, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash, chainId });

  const draw = async () => {
    if (!address) return;
    setError(null);
    try {
      return await writeContractAsync({
        address,
        abi: raffleAbi,
        functionName: "performUpkeep",
        args: ["0x"],
        chainId,
      });
    } catch (err) {
      setError(extractError(err));
      return undefined;
    }
  };

  return {
    draw,
    hash,
    isPending,
    isConfirming: receipt.isLoading,
    isConfirmed: receipt.isSuccess,
    error: error ?? (receipt.error ? extractError(receipt.error) : null),
    reset: () => {
      setError(null);
      reset();
    },
  };
}
