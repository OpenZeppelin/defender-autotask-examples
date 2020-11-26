const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');

// Definition for YearnV1EarnKeep3r
const ABI = [{"inputs":[],"name":"work","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"workable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
const Address = '0xe7F4ab593aeC81EcA754Da1B3B7cE0C42a13Ec0C';

// Work on job if it's needed using a Defender relay signer
async function workIfNeeded(signer, address) {
  const contract = new ethers.Contract(address, ABI, signer);
  if (await contract.workable()) {
    console.log(`Job is workable`);
    const tx = await contract.work();
    console.log(`Job worked: ${tx.hash}`);
  } else {
    console.log(`Job is not workable`);
  }
}

// Entrypoint for the Autotask
exports.handler = async function(credentials) {
  const provider = new DefenderRelayProvider(credentials);;
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fastest' });
  await workIfNeeded(signer, Address);
}

// Unit testing
exports.main = workIfNeeded;

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  exports.handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}

