# 💱 CHSwap Frontend — Celo Token Swap UI

<p align="center">
  <img src="https://img.shields.io/badge/Framework-Vite-646CFF.svg?logo=vite&logoColor=white" alt="Vite Badge"/>
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/Blockchain-Celo-35D07F.svg?logo=celo&logoColor=white" alt="Celo Badge"/>
  <img src="https://img.shields.io/badge/Web3-Wagmi-orange.svg?logo=ethereum&logoColor=white" alt="Wagmi Badge"/>
  <img src="https://img.shields.io/badge/UI-TailwindCSS-06B6D4.svg?logo=tailwindcss&logoColor=white" alt="Tailwind Badge"/>
  <img src="https://img.shields.io/badge/Connect-Reown-purple.svg?logo=walletconnect&logoColor=white" alt="Reown Badge"/>
</p>

CHSwap Frontend is a modern decentralized exchange interface built for **Celo blockchain**, enabling users to **buy and sell CHP tokens using USDC** through a sleek and responsive UI.  
It directly interacts with the smart contract deployed at  
🔗 **[CHSwap Contract Repository →](https://github.com/critterholes/Swap/tree/main/Contract)**

---

## 🧭 Overview

The CHSwap web app provides a **clean swapping experience** with wallet connection powered by **Reown AppKit** and transaction management handled via **Wagmi** and **Viem**.

- ⚡ Built with **Vite + React + TypeScript**
- 💅 Styled using **Tailwind CSS**
- 🪙 Connected to **Celo Mainnet**
- 🔗 Integrated with **Wagmi + Reown AppKit**
- 💼 Interacts with verified **CHSwap Smart Contract**

---

## 🧩 Project Structure

```
src/
├── abis/
│   ├── chSwap.ts        # Main contract ABI
│   └── erc20.ts         # Minimal ERC20 ABI
├── components/
│   └── SwapKiosk.tsx    # Core UI for Buy/Sell
├── hooks/
│   └── useSwapKiosk.ts  # Business logic hook
├── constants.ts          # Contract addresses and decimals
├── wagmi.ts              # Reown & Wagmi configuration
├── App.tsx               # Main layout
├── main.tsx              # Root render with providers
└── index.css             # Tailwind styles
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/critterholes/Swap.git
cd Swap/frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start the Development Server

```bash
npm run dev
```

The app will run locally at:
👉 **http://localhost:5173**

---

## 🔗 Environment & Connection

The frontend automatically connects to the **Celo Mainnet** and the deployed **CHSwap contract** defined in:

```typescript
// src/constants.ts
export const CHSWAP_ADDRESS = "0x7F160c87CB2324b3123E312049CDf1dfB90C89bd";
export const CHP_ADDRESS = "0x19D888b3E1f5d32a1F9bFaB5de3617325180DE5B";
export const USDC_ADDRESS = "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a";
```

If needed, you can edit these addresses to point to your own deployed contract instances.

---

## 🧠 Core Logic Overview

- **`useSwapKiosk` Hook**  
  Handles logic for fetching token balances, reading contract prices, managing approvals, and executing buy/sell transactions.

- **`SwapKiosk` Component**  
  Provides a dynamic interface to buy/sell tokens with clear feedback for wallet state, balances, and transactions.

- **`wagmi.ts` Configuration**  
  Initializes `Reown AppKit` and `WagmiAdapter` for the Celo chain and connects wallets via a unified `appkit-button`.

---

## 🧰 Technologies Used

| Tool | Purpose |
|------|----------|
| 🟣 **Reown AppKit** | Wallet connection & network management |
| 🦄 **Wagmi + Viem** | Smart contract interaction |
| ⚡ **Vite** | Lightning-fast build tool |
| 💠 **React + TypeScript** | Component-based frontend |
| 🎨 **TailwindCSS** | Modern utility-first styling |
| 💎 **Celo** | Blockchain network for token swaps |

---

## 🧪 Build & Preview

To create a production-ready build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🌍 Related Repository

Smart Contract Source:  
🔗 [CHSwap Solidity Contract →](https://github.com/critterholes/Swap/tree/main/Contract)

---

## 📄 License

This project is licensed under the [MIT License](https://github.com/critterholes/Swap/blob/main/LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/critterholes" target="_blank">Critterholes</a>
</p>
