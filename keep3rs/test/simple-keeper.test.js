const { expect } = require("chai");
const { main } = require("../src/simple-keeper");

async function deploy(name) {
  const contract = await ethers.getContractFactory(name)
    .then(f => f.deploy())
    .then(c => c.deployed());
  contract.name = name;
  return contract;
}

describe("simple-keeper", function() {
  let workable, keeper, keeperAddress;

  before(async function () {
    workable = await deploy('YearnV1EarnKeep3r');
    keeper = await ethers.getSigners().then(signers => signers[4]);
    keeperAddress = await keeper.getAddress();
  });

  // Emulates autotask run
  const run = () => main(keeper, workable.address);

  it("skips if there is no work to be done for any job", async function () {
    const txCount = await keeper.getTransactionCount();
    await run();
    expect(await keeper.getTransactionCount()).to.eq(txCount);
  });

  it("works on the job", async function () {
    const txCount = await keeper.getTransactionCount();
    await workable.requestWork();
    await run();
    expect(await keeper.getTransactionCount()).to.eq(txCount + 1);
    expect(await workable.needsWork()).to.be.false;
  });
});
