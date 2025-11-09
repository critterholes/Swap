// src/hooks/useSwapKiosk.ts
import { useState, useEffect, useMemo } from 'react';
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import {
  CHSWAP_ADDRESS,
  CHP_ADDRESS,
  USDC_ADDRESS,
  CHP_DECIMALS,
  USDC_DECIMALS,
} from '../constants';
import { chSwapAbi } from '../abis/chSwap';
import { erc20Abi } from '../abis/erc20';

// Define the two possible modes for the swap
export type SwapMode = 'buy' | 'sell';

/**
 * Custom hook to manage all logic for the Swap Kiosk.
 * This includes fetching data, calculating prices, and handling transactions.
 */
export function useSwapKiosk() {
  // --- Local UI State ---
  const [mode, setMode] = useState<SwapMode>('buy');
  const [amountIn, setAmountIn] = useState(''); // The raw string input from the user
  const [amountOut, setAmountOut] = useState(''); // The calculated, formatted output string
  
  // FIX 3: We need a local state for the txHash.
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  
  // We still use a manual state for 'isApproving' to show a specific "Approving..." message
  const [isApproving, setIsApproving] = useState(false);


  // --- Wagmi Account State ---
  const { address } = useAccount();

  // --- Asset Definitions based on Mode ---
  const inputToken = mode === 'buy' ? USDC_ADDRESS : CHP_ADDRESS;
  const outputToken = mode === 'buy' ? CHP_ADDRESS : USDC_ADDRESS;
  const inputDecimals = mode === 'buy' ? USDC_DECIMALS : CHP_DECIMALS;
  const outputDecimals = mode === 'buy' ? CHP_DECIMALS : USDC_DECIMALS;

  // --- Memoized BigInt Conversion ---
  const amountInBigInt = useMemo(() => {
    if (!amountIn) return 0n;
    try {
      return parseUnits(amountIn, inputDecimals);
    } catch {
      return 0n; // Handle invalid input
    }
  }, [amountIn, inputDecimals]);

  // --- 1. DATA FETCHING (Wagmi Reads) ---

  const { data: buyPrice } = useReadContract({
    address: CHSWAP_ADDRESS,
    abi: chSwapAbi,
    functionName: 'buyPricePer1000CHP_USDC',
  });

  const { data: sellPrice } = useReadContract({
    address: CHSWAP_ADDRESS,
    abi: chSwapAbi,
    functionName: 'sellPricePer1000CHP_USDC',
  });

  const { data: inputBalance } = useBalance({ address, token: inputToken });
  const { data: outputBalance } = useBalance({ address, token: outputToken });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: inputToken,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address!, CHSWAP_ADDRESS],
    // FIX 1: `enabled` must go inside the `query` object
    query: {
      enabled: !!address, // Only run if wallet is connected
    }
  });

  // --- 2. OUTPUT CALCULATION ---
  
  const feeAmountBigInt = useMemo(() => {
    if (mode === 'sell' && amountInBigInt > 0n) {
      return (amountInBigInt * 1n) / 100n; // 1% fee
    }
    return 0n;
  }, [mode, amountInBigInt]);

  const amountToApproveBigInt = mode === 'buy' 
    ? amountInBigInt 
    : amountInBigInt + feeAmountBigInt;

  const needsApproval = (allowance ?? 0n) < amountToApproveBigInt;

  useEffect(() => {
    if (amountInBigInt === 0n || (!buyPrice && !sellPrice)) {
      setAmountOut('');
      return;
    }

    let out = 0n;
    if (mode === 'buy' && buyPrice) {
      const chpOut = (amountInBigInt * 1000n) / buyPrice;
      out = chpOut - (chpOut / 100n); // Subtract 1% fee
    } else if (mode === 'sell' && sellPrice) {
      out = (amountInBigInt * sellPrice) / 1000n;
    }

    setAmountOut(formatUnits(out, outputDecimals));
  }, [amountInBigInt, mode, buyPrice, sellPrice, outputDecimals]);

  // --- 3. TRANSACTION PREPARATION (Wagmi Writes) ---

  // Get the main write function and its loading state
  const { isPending, writeContractAsync } = useWriteContract();
  
  // FIX 2: `useWaitForTransactionReceipt` no longer takes `onSuccess`.
  // We get its status and use `useEffect` to react to it.
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // This effect runs when the transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      setTxHash(undefined); // Clear the hash
      setAmountIn(''); // Reset input
      setIsApproving(false); // Reset approving state
      refetchAllowance(); // Re-check allowance
    }
  }, [isConfirmed, refetchAllowance]);


  // --- 4. ACTION HANDLER ---

  const handleSubmit = async () => {
    if (amountInBigInt === 0n) return;
    setTxHash(undefined); // Clear any old hash

    try {
      if (needsApproval) {
        setIsApproving(true);
        // FIX 3: Call `setTxHash` with the hash returned from the async call
        const hash = await writeContractAsync({
          address: inputToken,
          abi: erc20Abi,
          functionName: 'approve',
          args: [CHSWAP_ADDRESS, amountToApproveBigInt],
        });
        if (hash) setTxHash(hash);
      } else {
        // FIX 3: Call `setTxHash`
        const hash = await writeContractAsync({
          address: CHSWAP_ADDRESS,
          abi: chSwapAbi,
          functionName: mode === 'buy' ? 'buyCHP' : 'sellCHP',
          args: [amountInBigInt],
        });
        if (hash) setTxHash(hash);
      }
    } catch (e) {
      console.error(e);
      setIsApproving(false); // Reset loading on error
    }
  };

  // --- 5. RETURN VALUES ---
  
  const isLoading = isPending || isApproving || isConfirming;

  return {
    // State
    mode,
    amountIn,
    amountOut,
    isLoading,
    isConfirming,
    needsApproval,
    txHash,
    // Data
    inputSymbol: mode === 'buy' ? 'USDC' : 'CHP',
    outputSymbol: mode === 'buy' ? 'CHP' : 'USDC',
    inputBalance: inputBalance?.formatted.slice(0, 8) ?? '0.0',
    outputBalance: outputBalance?.formatted.slice(0, 8) ?? '0.0',
    // Actions
    setMode,
    setAmountIn,
    handleSubmit,
  };
}