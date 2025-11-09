// src/hooks/useSwapKiosk.ts
import { useState, useEffect, useMemo } from 'react';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
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

  // --- Wagmi Account State ---
  const { address } = useAccount();

  // --- Asset Definitions based on Mode ---
  const inputToken = mode === 'buy' ? USDC_ADDRESS : CHP_ADDRESS;
  const outputToken = mode === 'buy' ? CHP_ADDRESS : USDC_ADDRESS;
  const inputDecimals = mode === 'buy' ? USDC_DECIMALS : CHP_DECIMALS;
  const outputDecimals = mode === 'buy' ? CHP_DECIMALS : USDC_DECIMALS;

  // --- Memoized BigInt Conversion ---
  // Convert the user's string input into a BigInt for calculations
  const amountInBigInt = useMemo(() => {
    if (!amountIn) return 0n;
    try {
      return parseUnits(amountIn, inputDecimals);
    } catch {
      return 0n; // Handle invalid input (e.g., "1.2.3")
    }
  }, [amountIn, inputDecimals]);

  // --- 1. DATA FETCHING (Wagmi Reads) ---

  // Fetch the 1000_CHP : 1_USDC buy price
  const { data: buyPrice } = useContractRead({
    address: CHSWAP_ADDRESS,
    abi: chSwapAbi,
    functionName: 'buyPricePer1000CHP_USDC',
    watch: true, // Automatically refetch if price changes
  });

  // Fetch the 1000_CHP : 0.7_USDC sell price
  const { data: sellPrice } = useContractRead({
    address: CHSWAP_ADDRESS,
    abi: chSwapAbi,
    functionName: 'sellPricePer1000CHP_USDC',
    watch: true,
  });

  // Fetch user's balance of the INPUT token
  const { data: inputBalance } = useBalance({ address, token: inputToken, watch: true });
  // Fetch user's balance of the OUTPUT token
  const { data: outputBalance } = useBalance({ address, token: outputToken, watch: true });

  // Check how much the user has already approved our contract to spend
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: inputToken,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address!, CHSWAP_ADDRESS],
    enabled: !!address, // Only run if wallet is connected
  });

  // --- 2. OUTPUT CALCULATION ---
  
  // Calculate the fee amount for the 'sell' operation
  // The contract requires 1% extra CHP to be approved
  const feeAmountBigInt = useMemo(() => {
    if (mode === 'sell' && amountInBigInt > 0n) {
      return (amountInBigInt * 1n) / 100n; // 1% fee
    }
    return 0n;
  }, [mode, amountInBigInt]);

  // Determine the total amount to approve
  const amountToApproveBigInt = mode === 'buy' 
    ? amountInBigInt // For 'buy', approve the exact USDC amount
    : amountInBigInt + feeAmountBigInt; // For 'sell', approve CHP + 1% fee

  // Check if the user needs to approve more tokens
  const needsApproval = (allowance ?? 0n) < amountToApproveBigInt;

  // This effect calculates the `amountOut` whenever the input changes
  useEffect(() => {
    if (amountInBigInt === 0n || (!buyPrice && !sellPrice)) {
      setAmountOut('');
      return;
    }

    let out = 0n;
    if (mode === 'buy' && buyPrice) {
      // Buy: (usdcIn * 1000) / price
      const chpOut = (amountInBigInt * 1000n) / buyPrice;
      out = chpOut - (chpOut / 100n); // Subtract 1% fee
    } else if (mode === 'sell' && sellPrice) {
      // Sell: (chpIn * price) / 1000
      out = (amountInBigInt * sellPrice) / 1000n;
    }

    setAmountOut(formatUnits(out, outputDecimals));
  }, [amountInBigInt, mode, buyPrice, sellPrice, outputDecimals]);

  // --- 3. TRANSACTION PREPARATION (Wagmi Writes) ---

  const [txHash, setTxHash] = useState<`0x${string}`>();
  const [isApproving, setIsApproving] = useState(false); // Manually track approve loading

  // A. Prepare the 'approve' transaction
  const { config: approveConfig } = usePrepareContractWrite({
    address: inputToken,
    abi: erc20Abi,
    functionName: 'approve',
    args: [CHSWAP_ADDRESS, amountToApproveBigInt],
    enabled: needsApproval && amountInBigInt > 0n,
  });
  const { writeAsync: approve } = useContractWrite(approveConfig);

  // B. Prepare the 'buyCHP' transaction
  const { config: buyConfig } = usePrepareContractWrite({
    address: CHSWAP_ADDRESS,
    abi: chSwapAbi,
    functionName: 'buyCHP',
    args: [amountInBigInt], // Pass the USDC amount
    enabled: mode === 'buy' && !needsApproval && amountInBigInt > 0n,
  });
  const { writeAsync: buyCHP } = useContractWrite(buyConfig);

  // C. Prepare the 'sellCHP' transaction
  const { config: sellConfig } = usePrepareContractWrite({
    address: CHSWAP_ADDRESS,
    abi: chSwapAbi,
    functionName: 'sellCHP',
    args: [amountInBigInt], // Pass the CHP amount
    enabled: mode === 'sell' && !needsApproval && amountInBigInt > 0n,
  });
  const { writeAsync: sellCHP } = useContractWrite(sellConfig);

  // D. Wait for any transaction to be confirmed
  const { isLoading: isConfirming } = useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      // Reset state after success
      setTxHash(undefined);
      setAmountIn('');
      setIsApproving(false);
      refetchAllowance(); // Re-check allowance
    },
  });

  // --- 4. ACTION HANDLER ---

  // This function is called when the main button is clicked
  const handleSubmit = async () => {
    if (amountInBigInt === 0n) return;
    setTxHash(undefined);

    try {
      if (needsApproval) {
        setIsApproving(true);
        const tx = await approve?.();
        if (tx) setTxHash(tx.hash);
      } else {
        let tx;
        if (mode === 'buy') tx = await buyCHP?.();
        if (mode === 'sell') tx = await sellCHP?.();
        if (tx) setTxHash(tx.hash);
      }
    } catch (e) {
      console.error(e);
      setIsApproving(false); // Reset loading on error
    }
  };

  // --- 5. RETURN VALUES ---
  // Expose all state and functions needed by the UI component
  
  const isLoading = isApproving || isConfirming;

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