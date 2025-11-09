# 🦄 CHSwap — Celo Token Swap Ecosystem

<p align="center">
  <img src="https://img.shields.io/badge/Blockchain-Celo-35D07F.svg?logo=celo&logoColor=white" />
  <img src="https://img.shields.io/badge/Smart%20Contracts-Solidity-363636.svg?logo=solidity&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6.svg?logo=typescript&logoColor=white" />
</p>

**CHSwap** is a decentralized token swap ecosystem built on the **Celo blockchain**, providing a seamless and transparent way to **buy and sell CHP tokens using USDC**.  
It consists of two main parts — a **smart contract backend** and a **web-based frontend**.

---

## 📂 Project Structure

```
CHSwap/
├── Contract/     # Solidity smart contracts (Hardhat)
└── Web/          # Frontend app (React + TypeScript + Wagmi)
```

Each module has its own README for detailed setup, but this document gives you a complete overview.

---

## ⚙️ Part 1 — Smart Contract

🗁 **Location:** [/Contract](https://github.com/critterholes/Swap/tree/main/Contract)  
📄 **Full Documentation:** [View Contract README →](https://github.com/critterholes/Swap/blob/main/Contract/README.md)

### 🔧 Overview
The **CHSwap contract** handles all the token exchange logic between **CHP** and **USDC**, featuring:

- Buy and sell functions for CHP
- Configurable prices (`buyPricePer1000CHP_USDC`, `sellPricePer1000CHP_USDC`)
- Events for tracking on-chain swaps (`CHPBought`, `CHPSold`)
- Owner controls for deposit, withdraw, and price updates

---

### 🛠 Setup & Deployment

**1. Clone the repository**

```bash
git clone https://github.com/critterholes/Swap.git
cd Swap/Contract
```

**2. Install dependencies**

```bash
npm install
```

**3. Setup environment**

Create a `.env` file inside the `Contract` folder:

```bash
PRIVATE_KEY=""
CHP_ADDRESS=""
USDC_ADDRESS=""
CELO_RPC_URL="https://forno.celo.org"
ETHERSCAN_API_KEY=""
```

**4. Compile & Deploy**

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network celo
```

**5. Verify Contract (optional)**

```bash
npx hardhat verify --network celo <contract-address> "<chp-address>" "<usdc-address>"
```

---

## 💻 Part 2 — Web Frontend

🗁 **Location:** [/Web](https://github.com/critterholes/Swap/tree/main/Web)  
📄 **Full Documentation:** [View Web README →](https://github.com/critterholes/Swap/blob/main/Web/README.md)

### 🧠 Overview
The **CHSwap Web App** offers a clean and responsive interface for interacting with the deployed smart contract.  
It’s powered by:

- ⚡ **Vite + React + TypeScript**
- 🪙 **Celo + Wagmi + Viem**
- 💅 **TailwindCSS**
- 🔌 **Reown AppKit** for wallet connection

---

### 🧭 Quick Start

```bash
cd Web
npm install
npm run dev
```

Open your browser at  
🔗 **http://localhost:5173**

---

## 🌐 Architecture Summary

| Layer | Stack | Description |
|-------|--------|-------------|
| **Smart Contract** | Solidity + Hardhat | Manages all swap logic and on-chain pricing |
| **Frontend** | React + Vite + Wagmi | Provides a user-friendly interface for token swaps |
| **Blockchain** | Celo | Handles all transactions and token balances |
| **Wallet** | Reown AppKit | Connects wallet and processes swap transactions |

---

## 🧹 Tech Stack

| Category | Tools |
|-----------|-------|
| **Blockchain** | [Celo](https://celo.org) |
| **Smart Contracts** | [Solidity](https://soliditylang.org) + [OpenZeppelin](https://www.openzeppelin.com/contracts) |
| **Framework** | [Hardhat](https://hardhat.org) |
| **Frontend** | [React](https://react.dev) + [Vite](https://vitejs.dev) |
| **Styling** | [TailwindCSS](https://tailwindcss.com) |
| **Wallet Integration** | [Reown AppKit](https://reown.io) |
| **Environment** | [dotenv](https://www.npmjs.com/package/dotenv) |

---

## 📜 License

This project is licensed under the [Apache License](https://github.com/critterholes/Swap/blob/main/LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/critterholes" target="_blank">Critterholes</a><br/>
  <a href="https://github.com/critterholes/Swap/blob/main/Contract/README.md">Smart Contract Docs</a> •
  <a href="https://github.com/critterholes/Swap/blob/main/Web/README.md">Frontend Docs</a>
</p>