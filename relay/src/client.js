const { Relayer } = require('defender-relay-client');

// Main business logic
exports.main = async function(relayer) {
  // Send funds to a target address
  const txRes = await relayer.sendTransaction({
    to: '0xc7dd3ff5b387db0130854fe5f141a78586f417c6',
    value: 100,
    speed: 'fast',
    gasLimit: '1000000',
  });

  console.log(`Sent transaction ${txRes.hash}`);
  return txRes.hash;
}

// Entrypoint for the Autotask
exports.handler = async function(credentials) {
  const relayer = new Relayer(credentials);
  return exports.main(relayer);  
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  exports.handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}