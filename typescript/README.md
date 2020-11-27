# Defender Autotask example for Typescript

This folder shows how to code an Autotask using Typescript, and then using `tsc` to compile it to javascript in order to be run as an Autotask within Defender.

## Setup

The `tsconfig.json` sets the configuration for the typescript compiler to emit the javascript code to be used in the Defender Autotask. Run `yarn build` (or simply `tsc`) to compile the script in [`src/index.ts`](src/index.ts), copy the generated code from `dist/index.js`, and paste it into an Autotask.

## Running Locally

You can run the scripts locally, instead of in an Autotask, via a Defender Relayer. Create a Defender Relayer on mainnet, write down the API key and secret, and create a `.env` file in this folder with the following content:

```
API_KEY=yourapikey
API_SECRET=yourapisecret
```

Then run `yarn start`, which will run the typescript code using `ts-node`, and connecting to your Defender Relayer via the HTTP API.
