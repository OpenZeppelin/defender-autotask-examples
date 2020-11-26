// Import dependencies available in the autotask environment
import { DefenderRelayProvider } from 'defender-relay-client/lib/ethers';
import { ethers } from 'ethers';

// Import an ABI which will be embedded into the generated js
import IERC20 from '@openzeppelin/contracts/build/contracts/IERC20.json';

// Import a dependency not present in the autotask environment which will be included in the js bundle
import isOdd from 'is-odd';

// Address of the DAI contract (for this example)
const DAI = `0x6b175474e89094c44da98b954eedeac495271d0f`;

// Entrypoint for the Autotask
export async function handler(credentials) {
  const provider = new DefenderRelayProvider(credentials);
  const dai = new ethers.Contract(DAI, IERC20.abi, provider);
  const atto = await dai.totalSupply();
  const supply = Math.ceil(atto.div(1e18.toString()).toNumber());
  const parity = isOdd(supply) ? 'odd' : 'even';
  console.log(`DAI total supply is ${supply} (${parity})`);
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch((error) => { console.error(error); process.exit(1); });
}
