# Defender Autotask examples for Chainlink Keeper Network

This folder has Autotask scripts for monitoring and managing your Upkeeps registered in the [Chainlink Keeper Network](https://docs.chain.link/docs/kovan-keeper-network-beta). Refer to this [this step-by-step guide](https://docs.openzeppelin.com/defender/guide-chainlink) on how to register your contract as an Upkeep using Defender for more information.

:warning: **The Chainlink Keeper Network is currently in beta and only available in the Kovan testnet.**

## Scripts

- [`low-funds`](src/low-funds.js) requires a Relayer connected to Kovan, and will check the balance of your Upkeep given the job id. If it is below a threshold, it will send LINK from its own balance to `addFunds` to the Upkeep in the Registry. You can run this Autotask on a scheduled basis, or trigger it from a Sentinel whenever a new task was executed on your Upkeep.

## Setup

You can set up these scripts for running them in your local workstation. Clone this repository and, in the `chainlink` folder, run `yarn install` to install all dependencies.

## Running Locally

You can run the scripts locally, instead of in an Autotask, via a Defender Relayer. Create a Defender Relayer, write down the API key and secret, and create a `.env` file in the `chainlink` folder with the following content:

```
API_KEY=yourapikey
API_SECRET=yourapisecret
```

Then run `yarn low-funds` (or whatever script you want to execute). This will run the script on your local workstation using your Defender Relayer for connecting to the network.
