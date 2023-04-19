import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import builtins from 'builtin-modules';
import terser from '@rollup/plugin-terser';

// "node:" protocol
const nodePrefixedBuiltins = builtins.concat(builtins.map(x => 'node:' + x));
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    plugins: [terser()],
  },
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    json({ compact: true }),
    typescript(),
  ],
  external: [
    ...nodePrefixedBuiltins,
    'ethers',
    'web3',
    'axios',
    /^defender-relay-client(\/.*)?$/,
  ],
};
