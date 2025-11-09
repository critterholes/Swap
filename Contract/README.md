# 💱 CHSwap Contract on CELO

<p align="center">
  <img src="https://img.shields.io/badge/Framework-Hardhat-yellow.svg" alt="Hardhat Badge"/>
  <img src="https://img.shields.io/badge/Security-OpenZeppelin-blue.svg" alt="OpenZeppelin Badge"/>
  <img src="https://img.shields.io/badge/Blockchain-Celo-green.svg" alt="Celo Badge"/>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License Badge"/>
</p>

CHSwap is an ERC20 token swap contract deployed on the Celo network.
It allows users to swap between CHP and USDC tokens at defined rates with configurable fees and owner controls.

---

## 🧩 Features
- 🪙 Swap Support between CHP and USDC tokens.  
- 💰 Dynamic Pricing: Owner can update buy/sell prices anytime.  
- ⚙️ Fee System: Configurable percentage fee goes to contract owner.  
- 🔐 Token Reserve Management: Owner can deposit or withdraw tokens.  
- 🌐 Deployed on Celo Network (Mainnet supported).  
- 🧱 Built with Hardhat and OpenZeppelin standards.

---

## 📦 Project Structure

```
Contract/
├── contracts/
│   └── CHSwap.sol
├── scripts/
│   └── deploy.js
├── hardhat.config.js
├── package.json
├── .env
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/critterholes/Swap.git
cd Swap/Contract
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file inside `Contract/` directory:

```bash
PRIVATE_KEY=""
CHP_ADDRESS=""
USDC_ADDRESS=""
CELO_RPC_URL="https://forno.celo.org"
ETHERSCAN_API_KEY=""
```

---

## 🚀 Deployment

### 🧱 Compile Smart Contracts
```bash
npx hardhat compile
```

### 🌍 Deploy to Local Network
```bash
npx hardhat run scripts/deploy.js --network hardhat
```

### 🌐 Deploy to Celo Mainnet
```bash
npx hardhat run scripts/deploy.js --network celo
```

---

## 🔍 Verification

```bash
npx hardhat verify --network celo <DEPLOYED_CONTRACT_ADDRESS> "<CHP_ADDRESS>" "<USDC_ADDRESS>"
```

---

## 🧰 Tools Used
| Tool | Description |
|------|--------------|
| Hardhat | Ethereum development environment |
| OpenZeppelin | Secure smart contract library |
| Celo | Blockchain platform |
| Ethers.js | Ethereum JavaScript API |
| dotenv | Environment configuration |

---

## 📄 License
This project is licensed under the [MIT License](https://github.com/critterholes/Swap/blob/main/LICENSE).

---

Developed with ❤️ by [Critterholes](https://github.com/critterholes)
