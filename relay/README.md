# Defender Autotask examples with Relayer

This folder shows how to code an Autotask connected to a Defender Relayer. Examples show using the [`defender-relay-client`](https://www.npmjs.com/package/defender-relay-client) standalone and along with `ethers.js`. All examples can be run as an Autotask or locally. The `ethers` example also has a small suite of unit tests.

## Setup

Each Autotask script in the `src` folder is self-contained, and exposes different entrypoints depending on whether the code is to be run locally, within an autotask, or unit tested:

- The `require.main` check ensures the code is only run if the script is executed directly, which is used for local development.
- The `handler` function is called by the Defender Autotask runtime, and initializes the client using the injected `credentials`.
- The `main` function contains the business logic, and is called directly by the `handler` and the unit tests, with different clients depending on the environment.

To run any of these scripts as an Autotask, just copy their code into a new Autotask, and connect it to a Relayer.

## Testing

This project uses `buidler` for testing. Note that buidler is not required for Autotasks, it is just used for testing purposes here. The tests run in a development network managed by buidler, set up the environment, and call the `main` function for testing.

Run the tests via `yarn test`.

## Running Locally

You can run the scripts locally, instead of in an Autotask, via a Defender Relayer. Create a Defender Relayer on mainnet, write down the API key and secret, and create a `.env` file in this folder with the following content:

```
API_KEY=yourapikey
API_SECRET=yourapisecret
```

Then run `yarn client` or `yarn ethers`, depending on the script you want to run, which will run your script locally, connecting to your Relay via API.
