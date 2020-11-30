const { expect } = require("chai");
const { main } = require("../src/ethers");

async function deploy(name) {
  const contract = await ethers.getContractFactory(name)
    .then(f => f.deploy())
    .then(c => c.deployed());
  contract.name = name;
  return contract;
}

describe("relay-ethers", function() {
  let signer, recipient, erc20;

  before(async function () {
    erc20 = await deploy('MyERC20');
    signer = await ethers.getSigners().then(signers => signers[1]);
    recipient = await ethers.getSigners().then(signers => signers[2]).then(s => s.getAddress());
  });

  const run = () => main(signer, recipient, erc20.address);

  it('does nothing if relayer has no balance', async function () {
    const txCountBefore = await signer.getTransactionCount();
    await run();
    expect(await signer.getTransactionCount()).to.eq(txCountBefore);
  });

  it('sends balance to recipient', async function () {
    await erc20.transfer(await signer.getAddress(), 100);
    const tx = await run();
    
    const recipientBalance = await erc20.balanceOf(recipient);
    expect(recipientBalance.toString()).to.eq('100');
    
    const { events } = await tx.wait();
    expect(events[0].event).to.eq('Transfer');
  });
});