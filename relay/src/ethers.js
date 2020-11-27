const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');

// Inline ABI of the contract we'll be interacting with (check out the rollup example for a better way to handle this!)
const ERC20_ABI = [{anonymous:false,inputs:[{indexed:true,internalType:"address",name:"owner",type:"address"},{indexed:true,internalType:"address",name:"spender",type:"address"},{indexed:false,internalType:"uint256",name:"value",type:"uint256"}],name:"Approval",type:"event"},{anonymous:false,inputs:[{indexed:true,internalType:"address",name:"from",type:"address"},{indexed:true,internalType:"address",name:"to",type:"address"},{indexed:false,internalType:"uint256",name:"value",type:"uint256"}],name:"Transfer",type:"event"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"spender",type:"address"}],name:"allowance",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"approve",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"recipient",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transfer",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"address",name:"recipient",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transferFrom",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}];

// Main function, exported separately for testing
exports.main = async function(signer, recipient, contractAddress) {
  // Create contract instance from the relayer signer
  const dai = new ethers.Contract(contractAddress, ERC20_ABI, signer);

  // Check relayer balance via the Defender network provider
  const relayer = await signer.getAddress();
  const balance = await dai.balanceOf(relayer);

  // Send funds to recipient if non zero
  if (balance.gt(0)) {
    const tx = await dai.transfer(recipient, balance.toString());
    console.log(`Transferred ${balance.toString()} to ${recipient}`);
    return tx;
  } else {
    console.log(`No balance to transfer`);
  }
}

// Entrypoint for the Autotask
exports.handler = async function(credentials) {
  // Initialize defender relayer provider and signer
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  const contractAddress = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea'; // Rinkeby DAI contract
  return exports.main(signer, await signer.getAddress(), contractAddress); // Send funds to self
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  exports.handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}