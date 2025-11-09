const { ethers } = require("hardhat");
require("dotenv").config(); // Load environment variables from .env

async function main() {
  // 1. Get variables from .env
  const privateKey = process.env.PRIVATE_KEY;
  const chpAddress = process.env.CHP_ADDRESS;
  const usdcAddress = process.env.USDC_ADDRESS;

  // Safety checks
  if (!privateKey) {
    throw new Error("Please set your PRIVATE_KEY in the .env file");
  }
  if (!chpAddress || !usdcAddress) {
    throw new Error("Please set CHP_ADDRESS and USDC_ADDRESS in the .env file");
  }

  // 2. Setup Provider and Wallet (Deployer)
  const provider = ethers.provider;
  const deployer = new ethers.Wallet(privateKey, provider);

  console.log("Deploying contract with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 3. Deploy the contract
  console.log("Deploying CHSwap contract...");
  
  // We connect the factory with the signer (deployer)
  const chSwapFactory = await ethers.getContractFactory("CHSwap", deployer);
  
  const chSwap = await chSwapFactory.deploy(
    chpAddress,
    usdcAddress
  );

  await chSwap.waitForDeployment();

  const deployedAddress = await chSwap.target;
  console.log(`CHSwap contract successfully deployed to: ${deployedAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });