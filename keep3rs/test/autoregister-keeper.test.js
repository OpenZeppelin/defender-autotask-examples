const { expect } = require("chai");
const { main, Jobs } = require("../src/autoregister-keeper");
const mockdate = require('mockdate');

async function deploy(name) {
  const contract = await ethers.getContractFactory(name)
    .then(f => f.deploy())
    .then(c => c.deployed());
  contract.name = name;
  return contract;
}

describe("autoregister-keeper", function() {
  const workableNames = ['YearnV1EarnKeep3r', 'HegicPoolKeep3r', 'UniswapV2SlidingOracle'];
  let workables, registry, jobs, keeper, keeperAddress;

  before(async function () {
    workables = await Promise.all(workableNames.map(name => deploy(name)));
    registry = await deploy('KeeperRegistry');
    jobs = Jobs.map(job => ({ ...job, address: workables.find(w => w.name === job.name).address }));
    keeper = await ethers.getSigners().then(signers => signers[1]);
    keeperAddress = await keeper.getAddress();
  });

  // Emulates autotask run
  const run = () => main(keeper, jobs, registry.address);

  it("bonds relayer as a keeper", async function() {
    await run();
    expect(await registry.bondings(keeperAddress, registry.address).then(b => b.toNumber())).to.be.gt(0);
  });

  it("waits until activation period", async function () {
    await ethers.provider.send('evm_increaseTime', [10]);
    mockdate.set(Date.now() + 10 * 1000);
    await run();
    expect(await registry.keepers(keeperAddress)).to.be.false;
  });

  it("activates once period is over", async function () {
    await ethers.provider.send('evm_increaseTime', [650]);
    mockdate.set(Date.now() + 650 * 1000);
    await run();
    expect(await registry.keepers(keeperAddress)).to.be.true;
  });

  it("skips if there is no work to be done for any job", async function () {
    const txCount = await keeper.getTransactionCount();
    await run();
    expect(await keeper.getTransactionCount()).to.eq(txCount);
  });

  it("works on all available jobs", async function () {
    const txCount = await keeper.getTransactionCount();
    await Promise.all(workables.map(workable => workable.requestWork()));
    await run();
    
    expect(await keeper.getTransactionCount()).to.eq(txCount + jobs.length);
    const worksNeeded = await Promise.all(workables.map(workable => workable.needsWork()));
    expect(worksNeeded).to.be.deep.eq(jobs.map(() => false));
  });
});
