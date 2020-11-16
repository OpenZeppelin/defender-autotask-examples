const { expect } = require("chai");
const { main, Jobs } = require("../src/frequent-keeper");

async function deploy(name) {
  const contract = await ethers.getContractFactory(name)
    .then(f => f.deploy())
    .then(c => c.deployed());
  contract.name = name;
  return contract;
}

describe("faster-keeper", function() {
  const workableNames = ['YearnV1EarnKeep3r', 'HegicPoolKeep3r', 'UniswapV2SlidingOracle'];
  let workables, jobs, keeper, keeperAddress, registry;

  before(async function () {
    workables = await Promise.all(workableNames.map(name => deploy(name)));
    jobs = Jobs.map(job => ({ ...job, address: workables.find(w => w.name === job.name).address }));
    keeper = await ethers.getSigners().then(signers => signers[2]);
    keeperAddress = await keeper.getAddress();
    registry = await deploy('KeeperRegistry').then(c => c.connect(keeper));
  });

  // Emulates autotask run
  const run = () => main(keeper, jobs, 1000, registry.address);

  it("skips if keeper is not registered", async function () {
    await Promise.all(workables.map(workable => workable.requestWork()));
    const txCount = await keeper.getTransactionCount();
    await run();
    expect(await keeper.getTransactionCount()).to.eq(txCount);
  });

  it("works on all available jobs if registered", async function () {
    await registry.bond(registry.address, 0);
    await ethers.provider.send('evm_increaseTime', [650]);
    await registry.activate(registry.address);

    const txCount = await keeper.getTransactionCount();
    await Promise.all(workables.map(workable => workable.requestWork()));
    
    await run();
    
    expect(await keeper.getTransactionCount()).to.eq(txCount + jobs.length);
    const worksNeeded = await Promise.all(workables.map(workable => workable.needsWork()));
    expect(worksNeeded).to.be.deep.eq(jobs.map(() => false));
  });

  it("skips if there is no work to be done for any job", async function () {
    const txCount = await keeper.getTransactionCount();
    await run();
    expect(await keeper.getTransactionCount()).to.eq(txCount);
  });

  it("discovers work during run", async function () {
    const txCount = await keeper.getTransactionCount();
    const [workable] = workables;
    setTimeout(() => workable.requestWork(), 200);

    await run();
    
    expect(await keeper.getTransactionCount()).to.eq(txCount + 1);
    expect(await workable.needsWork()).to.eq(false);
  });
});
