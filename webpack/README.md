# Defender Autotask example using Webpack

This folder shows how to code an Autotask with package dependencies not available in the Autotasks runtime, by generating a bundle using [Webpack](https://webpack.js.org/) that includes all dependencies, along with imported ABIs so they don't have to be copied into the script. This example uses typescript, but is also applicable to javascript.

## Setup

The `webpack.config.js` file instructs Webpack to output a single file to `dist/index.js` based on the `src/index.ts` input file. All dependencies tagged as `external` will not be included in the bundle, since they are available in the Autotask environment - other dependencies, such as `is-odd` in the example, will be embedded in it.

Run `yarn build` to have Webpack generate the `dist/index.js` file, and copy it into your Autotask.

## Running Locally

You can run the scripts locally, instead of in an Autotask, via a Defender Relayer. Create a Defender Relayer on mainnet, write down the API key and secret, and create a `.env` file in this folder with the following content:

```
API_KEY=yourapikey
API_SECRET=yourapisecret
```

Then run `yarn start` to run your script locally, connecting to your Relay via API.
