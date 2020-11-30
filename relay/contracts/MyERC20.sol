// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    constructor() public ERC20("MyToken", "MYT") {
        _mint(msg.sender, 100 ether);
    }
}
