// src/components/SwapKiosk.tsx
import { useSwapKiosk } from '../hooks/useSwapKiosk';
// FIX: 'SwapMode' is a type, so it must be imported using 'import type'
import type { SwapMode } from '../hooks/useSwapKiosk';
import { useAccount } from 'wagmi';

/**
 * The main UI component for the swap kiosk.
 * It's a "dumb" component that gets all its logic from the `useSwapKiosk` hook.
 */
export function SwapKiosk() {
  const { address } = useAccount();

  // Get all state and functions from the logic hook
  const {
    mode,
    amountIn,
    amountOut,
    isLoading,
    isConfirming,
    needsApproval,
    txHash,
    inputSymbol,
    outputSymbol,
    inputBalance,
    outputBalance,
    setMode,
    setAmountIn,
    handleSubmit,
  } = useSwapKiosk();

  /**
   * Handler for switching between 'buy' and 'sell' tabs.
   * Resets the input amount.
   */
  const handleModeChange = (newMode: SwapMode) => {
    setMode(newMode);
    setAmountIn(''); // Reset input when mode changes
  };

  /**
   * Helper function to determine the text for the main button.
   */
  const getButtonText = () => {
    if (!address) return "Connect Wallet";
    if (isLoading) return isConfirming ? "Confirming..." : "Approving...";
    if (amountIn === '' || amountIn === '0') return "Enter Amount";
    if (needsApproval) return `Approve ${inputSymbol}`;
    return mode === 'buy' ? "Buy CHP" : "Sell CHP";
  };

  return (
    <div className="w-full max-w-md p-5 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 text-white">
      
      {/* --- Tabs: Buy / Sell --- */}
      <div className="flex mb-4 rounded-lg bg-gray-900 p-1">
        <button
          onClick={() => handleModeChange('buy')}
          className={`flex-1 p-2 rounded-md font-semibold ${mode === 'buy' ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          Buy CHP
        </button>
        <button
          onClick={() => handleModeChange('sell')}
          className={`flex-1 p-2 rounded-md font-semibold ${mode === 'sell' ? 'bg-pink-600' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          Sell CHP
        </button>
      </div>

      {/* --- Input Panel --- */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm text-gray-400">{mode === 'buy' ? 'You Pay' : 'You Sell'}</label>
          <span className="text-xs text-gray-400">Balance: {inputBalance}</span>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="w-full text-3xl bg-transparent outline-none text-white"
            placeholder="0"
          />
          <span className="text-xl font-medium text-gray-300 ml-2">{inputSymbol}</span>
        </div>
      </div>

      <div className="flex justify-center my-3 text-2xl text-gray-500">↓</div>

      {/* --- Output Panel --- */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm text-gray-400">{mode === 'buy' ? 'You Get (Est.)' : 'You Get'}</label>
          <span className="text-xs text-gray-400">Balance: {outputBalance}</span>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            disabled
            value={amountOut}
            readOnly
            className="w-full text-3xl bg-transparent text-gray-400 outline-none"
            placeholder="0"
          />
          <span className="text-xl font-medium text-gray-300 ml-2">{outputSymbol}</span>
        </div>
      </div>
      
      {/* --- Action Button --- */}
      <button
        onClick={handleSubmit}
        disabled={!address || isLoading || (amountIn === '' || amountIn === '0')}
        className={`w-full p-4 mt-5 font-bold text-lg rounded-lg
          ${mode === 'buy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700'}
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {getButtonText()}
      </button>

      {/* --- Transaction Info --- */}
      {txHash && (
        <div className="text-center mt-3 text-sm text-gray-400">
          <p>Transaction sent! <a href={`https://celoscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View on CeloScan</a></p>
        </div>
      )}
    </div>
  );
}