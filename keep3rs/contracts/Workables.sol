//SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

contract Workable {
  bool public needsWork = false;

  event Worked(address worker);

  function _work() internal {
    require(needsWork, "!workable()");
    needsWork = false;
    emit Worked(msg.sender);
  }

  function requestWork() external {
    needsWork = true;
  }
}

contract UniswapV2SlidingOracle is Workable {
  function work() public {
    _work();
  }
  
  function workable() public view returns (bool) {
    return needsWork;
  }
}

contract HegicPoolKeep3r is Workable {
  function claimRewards() public {
    _work();
  }
  
  function workable() public view returns (bool) {
    return needsWork;
  }
}

contract YearnV1EarnKeep3r is Workable {
  function work() public {
    _work();
  }
  
  function workable() public view returns (bool) {
    return needsWork;
  }
}