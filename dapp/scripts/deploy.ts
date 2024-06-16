import { ethers } from "hardhat";

async function main() {
  const web3Voting = await ethers.deployContract("Web3Voting", [], {
  });

  await web3Voting.waitForDeployment();

  console.log(
    `Web3Voting deployed to ${web3Voting.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
