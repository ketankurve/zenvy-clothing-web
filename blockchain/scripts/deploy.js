const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Grab the contract factory 
  const ZenvyLedger = await hre.ethers.getContractFactory("ZenvyLedger");
  
  // Deploy the contract
  const ledger = await ZenvyLedger.deploy();

  // Wait for the deployment to finish
  await ledger.waitForDeployment();

  // Retrieve and log the deployed address
  const contractAddress = await ledger.getAddress();
  console.log(`✅ ZenvyLedger successfully deployed to: ${contractAddress}`);
}

// Execute the deployment
main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});