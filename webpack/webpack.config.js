const path = require('path');

module.exports = {
  // We define one entrypoint per each autotask script
  entry: {
    javascript: './src/javascript.js',
    typescript: './src/typescript.ts',
  },
  module: {
    rules: [
      // Handle typescript files
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
    ],
  },
  resolve: {
    // Process typescript and javascript files, as well as json to load abis
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  // Generate files to the dist folder
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Ensure the generated javascript remains readable
  optimization: {
    minimize: false
  },
  // Do not bundle these dependencies since they are available in the autotasks environment
  externals: {
    'aws-sdk': 'aws-sdk',
    'defender-relay-client': 'defender-relay-client',
    'ethers': 'commonjs2 ethers',
    'web3': 'web3',
  },
  // Aim at nodejs
  target: 'node',
};
