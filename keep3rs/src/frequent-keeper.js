const { ethers } = require("ethers");
const { DefenderRelaySigner } = require('defender-relay-client/lib/ethers');

// ABIs for jobs and registry (contain only the methods needed, not the full ABIs of the contracts)
const ABIs = {
  UniswapV2SlidingOracle: [{"inputs":[],"name":"workable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"work","outputs":[],"stateMutability":"nonpayable","type":"function"}],
  HegicPoolKeep3r: [{"inputs":[],"name":"workable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"}],
  YearnV1EarnKeep3r: [{"inputs":[],"name":"work","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"workable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}],
  Registry: [{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"keepers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"bonding","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"bond","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"bondings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"bonding","type":"address"}],"name":"activate","outputs":[],"stateMutability":"nonpayable","type":"function"}],
}

// Definition for all jobs to execute
const Jobs = [
  { name: 'UniswapV2SlidingOracle', address: '0xCA2E2df6A7a7Cf5bd19D112E8568910a6C2D3885', workableFn: 'workable', workFn: 'work' },
  { name: 'HegicPoolKeep3r',        address: '0x5DDe926b0A31346f2485900C5e64c2577F43F774', workableFn: 'workable', workFn: 'claimRewards' },
  { name: 'YearnV1EarnKeep3r',      address: '0xe7F4ab593aeC81EcA754Da1B3B7cE0C42a13Ec0C', workableFn: 'workable', workFn: 'work' },
];

// Address for the Keeper registry
const RegistryAddress = '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44';

// Running time of this autotask
const Duration = 55000;

// Pauses for milliseconds
async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });
}

// Checks if there is available work on the job and works it
async function workIfNeeded(contract, job) {
  if (await contract[job.workableFn]()) {
    console.log(`${job.name} is workable`);
    const tx = await contract[job.workFn]();
    console.log(`${job.name} worked: ${tx.hash}`);
    return true;
  } 
  return false;
}

// Checks if there is available work on the job every 5s
// There is no need to check more often, since checking once per block is enough
// Avoid further increasing the frequency or it may lead to provider quota errors
async function tryWorking(signer, job, duration) {
  try {
    const start = Date.now();
    const contract = new ethers.Contract(job.address, ABIs[job.name], signer);
    while (Date.now() - start < duration) {
      if (await workIfNeeded(contract, job)) return;
      await sleep(duration / 11);
    }
    console.log(`${job.name} is not workable`);
  } catch (err) {
    console.log(`Error working ${job.name}: ${err.message ? err.message.slice(0, 100) : 'unknown error'}`);
  }
}

async function main(signer, jobs, duration, registryAddress) {
  // Check if relayer is a registered keeper
  const registry = new ethers.Contract(registryAddress, ABIs.Registry, signer);
  const keeperAddress = await signer.getAddress();
  const isKeeper = await registry.keepers(keeperAddress);
  if (!isKeeper) {
    console.log(`Relayer ${keeperAddress} has not yet been activated as a keep3r`);
    return;
  }

  // Monitor all jobs in parallel every 5 seconds and return after 1 min
  console.log(`Starting work...`);
  await Promise.all(jobs.map(job => tryWorking(signer, job, duration)));
}

// Entrypoint for the Autotask
exports.handler = async function(credentials) {
  const provider = ethers.getDefaultProvider();
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fastest' });
  await main(signer, Jobs, Duration, RegistryAddress);
}

// For unit testing
exports.main = main;
exports.Jobs = Jobs;

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  exports.handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}

