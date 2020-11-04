async function main() {
  const contract = await ethers.getContractFactory("YearnV1EarnKeep3r").then(f => f.deploy()).then(c => c.deployed());
  console.log(`Sample workable deployed at:\n${contract.address}`);
  const tx = await contract.requestWork().then(t => t.wait());
  console.log(`Requested work for Workable contract:\n${tx.hash}`);
  const registry = await ethers.getContractFactory("KeeperRegistry").then(f => f.deploy()).then(c => c.deployed());
  console.log(`Sample keep3r registry deployed at:\n${registry.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
