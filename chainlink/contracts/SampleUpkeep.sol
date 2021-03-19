 pragma solidity 0.7.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleUpkeep is Ownable {
  bool public shouldPerformUpkeep;
  
  bytes public bytesToSend;
  bytes public receivedBytes;

  function setShouldPerformUpkeep(bool _should) public onlyOwner {
    shouldPerformUpkeep = _should;
  }

  function setBytesToSend(bytes memory _bytes) public onlyOwner {
    bytesToSend = _bytes;
  }

  function checkUpkeep(bytes calldata data) external returns (bool, bytes memory) {
    return (shouldPerformUpkeep, bytesToSend);
  }

  function performUpkeep(bytes calldata data) external {
    shouldPerformUpkeep = false;
    receivedBytes = data;
  }
}