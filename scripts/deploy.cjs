const hre = require("hardhat");

async function main() {
  // Deploy the LandRegistry contract
  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();
  
  await landRegistry.deployed();
  
  console.log(`LandRegistry deployed to: ${landRegistry.address}`);
  
  // Verify the contract on block explorer (optional)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await landRegistry.deployTransaction.wait(6);
    
    console.log("Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: landRegistry.address,
        constructorArguments: [],
      });
    } catch (error) {
      console.error("Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
