import { Relayer } from 'defender-relay-client';
import { RelayerModel, RelayerParams } from 'defender-relay-client/lib/relayer';

// Entrypoint for the Autotask
export async function handler(credentials: RelayerParams) {
  const relayer = new Relayer(credentials);
  const info: RelayerModel = await relayer.getRelayer();
  console.log(`Relayer address is ${info.address}`);
}

// Sample typescript type definitions
type EnvInfo = {
  API_KEY: string;
  API_SECRET: string;
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env as EnvInfo;
  handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch((error: Error) => { console.error(error); process.exit(1); });
}
