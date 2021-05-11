import { Contract, BigNumber } from "ethers";

export async function getTotalSupply(contract: Contract): Promise<number> {
  const atto: BigNumber = await contract.totalSupply();
  const supply: number = Math.ceil(atto.div(1e18.toString()).toNumber());
  return supply;
}