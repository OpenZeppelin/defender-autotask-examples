# Defender Autotask examples for keep3r.network

This folder has Autotask scripts for running [Keep3rs](https://docs.keep3r.network/keepers) within the keep3r.network. Refer to this [this step-by-step guide](https://docs.openzeppelin.com/defender/guide-keep3r) on how to run a Keeper for more information. Bear in mind the Keep3r Network 

:warning: **The Keep3r Network is currently in beta, use it at your own risk. Available jobs are changing frequently, so make sure to check the latest set of jobs in the [Keep3r Network registry](https://docs.keep3r.network/registry).**

## Scripts

- [`simple-keeper`](src/simple-keeper.js) requires a Relayer already activated as a Keeper, and will attempt to execute work from the [`YearnV1EarnKeep3r`](https://etherscan.io/address/0xe7F4ab593aeC81EcA754Da1B3B7cE0C42a13Ec0C) job.

- [`multiple-jobs-keeper`](src/multiple-jobs-keeper.js) requires a Relayer already activated as a Keeper as well, but will attempt to work from the [`HegicPoolKeep3r`](https://etherscan.io/address/0x5DDe926b0A31346f2485900C5e64c2577F43F774), [`UniswapV2SlidingOracle`](https://etherscan.io/address/0xd20b88Ca8bF84Ca829f7A9Cf0eC64e2bFE91c204), and [`YearnV1EarnKeep3r`](https://etherscan.io/address/0xe7F4ab593aeC81EcA754Da1B3B7cE0C42a13Ec0C) jobs.

- [`autoregister-keeper`](src/autoregister-keeper.js) will automatically bond the attached Relayer as a Keeper with zero collateral, wait for the activation period to finish, activate the relayer, and then execute the same jobs as `multiple-jobs-keeper`.

## Setup

You can set up these scripts for running them in your local workstation. Clone this repository and, in the `keep3rs` folder, run `yarn install` to install all dependencies.

## Testing

After setting up your project locally, run `yarn test` to run the tests for the scripts locally using [buidler](https://buidler.dev/).

```
$ yarn test

  autoregister-keeper
    ✓ bonds relayer as a keeper (110ms)
    ✓ waits until activation period (45ms)
    ✓ activates once period is over (138ms)
    ✓ skips if there is no work to be done for any job (52ms)
    ✓ works on all available jobs (373ms)

  multiple-jobs-keeper
    ✓ skips if there is no work to be done for any job
    ✓ works on all available jobs (358ms)

  multiple-jobs-keeper
    ✓ skips if there is no work to be done for any job
    ✓ works on the job (135ms)

  9 passing (2s)
```

## Running Locally

You can run the scripts locally, instead of in an Autotask, via a Defender Relayer. Create a Defender Relayer on mainnet, write down the API key and secret, and create a `.env` file in the `keep3rs` folder with the following content:

```
API_KEY=yourapikey
API_SECRET=yourapisecret
```

Then run `yarn simple-keeper` (or whatever script you want to execute). This will run the script on your local workstation using your Defender Relayer for sending `work` transactions to the keep3r network.
