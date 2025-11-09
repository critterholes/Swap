// src/App.tsx
import { SwapKiosk } from './components/SwapKiosk';

/**
 * The main App component.
 * This sets up the overall page layout.
 */
function App() {
  return (
    // Main container with dark background
    <div className="min-h-screen bg-gray-900 text-white p-4">
      
      {/* HEADER
        - Uses 'flex' to create a row.
        - 'justify-between' pushes children to opposite ends (left and right).
        - 'items-center' vertically centers them.
      */}
      <header className="flex justify-between items-center mb-12 max-w-5xl mx-auto">
        
        {/* Left Side: Title */}
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">
          CHSwap
        </h1>
        
        {/* Right Side: Reown Connect Button */}
        <appkit-button />

      </header>

      {/* MAIN CONTENT
        - 'flex justify-center' centers the SwapKiosk component horizontally.
      */}
      <main className="flex justify-center">
        <SwapKiosk />
      </main>

    </div>
  );
}

export default App;