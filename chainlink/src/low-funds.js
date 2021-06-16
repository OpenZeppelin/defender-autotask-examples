const ERC20_ABI = [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MAXIMUM_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"}],"name":"salvageTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DipTokensale","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
const REGISTRY_ABI = [{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getUpkeep","outputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint32","name":"executeGas","type":"uint32"},{"internalType":"bytes","name":"checkData","type":"bytes"},{"internalType":"uint96","name":"balance","type":"uint96"},{"internalType":"address","name":"lastKeeper","type":"address"},{"internalType":"address","name":"admin","type":"address"},{"internalType":"uint64","name":"maxValidBlocknumber","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint96","name":"amount","type":"uint96"}],"name":"addFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"LINK","outputs":[{"internalType":"contract LinkTokenInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
const REGISTRY_ADDRESS = '0xAaaD7966EBE0663b8C9C6f683FB9c3e66E03467F';

const { ethers } = require("ethers");
const { DefenderRelayProvider, DefenderRelaySigner } = require('defender-relay-client/lib/ethers');

// Change these values to your own job-id and values
const JOB_ID = '2';
const MIN_BALANCE = 1e16.toString();
const REFILL_VALUE = 1e18.toString();
const MAX_VALUE = ethers.BigNumber.from(2).pow(256).sub(1);

// Autotask entrypoint
exports.handler = async function(credentials) {
  // Initialize provider, signer, and contract instances
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);

  // Check balance and refill if threshold has been reached
  const { balance, target } = await registry.getUpkeep(JOB_ID);
  if (balance.lt(MIN_BALANCE)) {
    console.log(`Low balance ${ethers.utils.formatEther(balance)} in job ${JOB_ID} (${target})`);
    const token = new ethers.Contract(await registry.LINK(), ERC20_ABI, signer);
    const allowance = await token.allowance(await signer.getAddress(), REGISTRY_ADDRESS);
    if (allowance.lt(REFILL_VALUE)) await token.approve(REGISTRY_ADDRESS, MAX_VALUE).then(tx => tx.wait());
    const tx = await registry.addFunds(JOB_ID, REFILL_VALUE);
    console.log(`Sent refill transaction for ${ethers.utils.formatEther(REFILL_VALUE)}: ${tx.hash}`);
  } else {
    console.log(`Balance ${ethers.utils.formatEther(balance)} for job ${JOB_ID} is above threshold`);
  }
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  exports.handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}

