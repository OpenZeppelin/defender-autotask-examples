const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');

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

// Work on jobs if it's needed using a Defender relay signer
async function workIfNeeded(signer, jobs) {
  for (const job of jobs) {
    const contract = new ethers.Contract(job.address, ABIs[job.name], signer);
    if (await contract[job.workableFn]()) {
      console.log(`${job.name} is workable`);
      const tx = await contract[job.workFn]();
      console.log(`${job.name} worked: ${tx.hash}`);
    } else {
      console.log(`${job.name} is not workable`);
    }
  }
}

// Entrypoint for the Autotask
exports.handler = async function(credentials) {
  const provider = new DefenderRelayProvider(credentials);;
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fastest' });
  await workIfNeeded(signer, Jobs);
}

// For unit testing
exports.main = workIfNeeded;
exports.Jobs = Jobs;

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  exports.handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}

