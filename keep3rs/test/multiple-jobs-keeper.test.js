const { expect } = require("chai");
const { main, Jobs } = require("../src/multiple-jobs-keeper");

async function deploy(name) {
  const contract = await ethers.getContractFactory(name)
    .then(f => f.deploy())
    .then(c => c.deployed());
  contract.name = name;
  return contract;
}

describe("multiple-jobs-keeper", function() {
  const workableNames = ['YearnV1EarnKeep3r', 'HegicPoolKeep3r', 'UniswapV2SlidingOracle'];
  let workables, jobs, keeper, keeperAddress;

  before(async function () {
    workables = await Promise.all(workableNames.map(name => deploy(name)));
    jobs = Jobs.map(job => ({ ...job, address: workables.find(w => w.name === job.name).address }));
    keeper = await ethers.getSigners().then(signers => signers[3]);
    keeperAddress = await keeper.getAddress();
  });

  // Emulates autotask run
  const run = () => main(keeper, jobs);

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
