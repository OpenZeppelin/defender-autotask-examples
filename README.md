# Defender Autotask Examples

This repository contains sample code snippets for [Defender Autotasks](https://docs.openzeppelin.com/defender/autotasks). Follow the instructions in each folder for more info on how to use them.

**Disclaimer**: The scripts in this repository have not been audited. Please file an issue if you stumble upon any mistake.

- The [`relay`](relay) folder contains detailed examples on how to use the `defender-relay-client` package from an Autotask, both standalone and integrated with `ethers.js`, including local development and unit testing.
- The [`typescript`](typescript) folder shows how to write an autotask in typescript, and use `tsc` to compile it to javascript that can be run within Defender.
- The [`rollup`](rollup) folder includes a more complex example, that generates a bundle that incorporates additional dependencies not available in the Autotasks runtime, and embeds contract ABIs in the generated output.
- The [`keep3rs`](keep3rs) folder contains autotasks to execute jobs as a keeper within the [Keep3r Network](https://keep3r.network/), along with their respective unit tests.

