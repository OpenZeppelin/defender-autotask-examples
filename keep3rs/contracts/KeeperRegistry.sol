//SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import "./SafeMath.sol";

contract KeeperRegistry {
    using SafeMath for uint256;

    /// @notice Worked a job
    event KeeperWorked(address indexed credit, address indexed job, address indexed keeper, uint block);

    /// @notice Keeper bonding
    event KeeperBonding(address indexed keeper, uint block, uint active, uint bond);

    /// @notice Keeper bonded
    event KeeperBonded(address indexed keeper, uint block, uint activated, uint bond);

    /// @notice Keeper unbonding
    event KeeperUnbonding(address indexed keeper, uint block, uint deactive, uint bond);

    /// @notice Keeper unbound
    event KeeperUnbound(address indexed keeper, uint block, uint deactivated, uint bond);

    uint constant public BOND = 10 minutes;
    uint constant public UNBOND = 14 days;
    uint constant public LIQUIDITYBOND = 3 days;

    /// @notice tracks all current bondings (time)
    mapping(address => mapping(address => uint)) public bondings;
    /// @notice tracks all current unbondings (time)
    mapping(address => mapping(address => uint)) public unbondings;
    /// @notice allows for partial unbonding
    mapping(address => mapping(address => uint)) public partialUnbonding;
    /// @notice tracks all current pending bonds (amount)
    mapping(address => mapping(address => uint)) public pendingbonds;
    /// @notice tracks how much a keeper has bonded
    mapping(address => mapping(address => uint)) public bonds;
    /// @notice tracks underlying votes (that don't have bond)
    mapping(address => uint) public votes;
    /// @notice tracks last job performed for a keeper
    mapping(address => uint) public lastJob;

    /// @notice total bonded (totalSupply for bonds)
    uint public totalBonded = 0;
    /// @notice tracks when a keeper was first registered
    mapping(address => uint) public firstSeen;

    /// @notice list of all current keepers
    mapping(address => bool) public keepers;
    /// @notice blacklist of keepers not allowed to participate
    mapping(address => bool) public blacklist;

    /// @notice traversable array of keepers to make external management easier
    address[] public keeperList;

    uint internal _gasUsed;

    function _bond(address bonding, address _from, uint _amount) internal {
        bonds[_from][bonding] = bonds[_from][bonding].add(_amount);
        if (bonding == address(this)) {
            totalBonded = totalBonded.add(_amount);
        }
    }

    function _unbond(address bonding, address _from, uint _amount) internal {
        bonds[_from][bonding] = bonds[_from][bonding].sub(_amount);
        if (bonding == address(this)) {
            totalBonded = totalBonded.sub(_amount);
        }
    }

    /**
     * @notice begin the bonding process for a new keeper
     * @param bonding the asset being bound
     * @param amount the amount of bonding asset being bound
     */
    function bond(address bonding, uint amount) external {
        require(!blacklist[msg.sender], "bond: blacklisted");
        bondings[msg.sender][bonding] = now.add(BOND);
        pendingbonds[msg.sender][bonding] = pendingbonds[msg.sender][bonding].add(amount);
        emit KeeperBonding(msg.sender, block.number, bondings[msg.sender][bonding], amount);
    }

    /**
     * @notice get full list of keepers in the system
     */
    function getKeepers() external view returns (address[] memory) {
        return keeperList;
    }

    /**
     * @notice allows a keeper to activate/register themselves after bonding
     * @param bonding the asset being activated as bond collateral
     */
    function activate(address bonding) external {
        require(!blacklist[msg.sender], "activate: blacklisted");
        require(bondings[msg.sender][bonding] != 0 && bondings[msg.sender][bonding] < now, "activate: bonding");
        if (firstSeen[msg.sender] == 0) {
          firstSeen[msg.sender] = now;
          keeperList.push(msg.sender);
          lastJob[msg.sender] = now;
        }
        keepers[msg.sender] = true;
        _bond(bonding, msg.sender, pendingbonds[msg.sender][bonding]);
        pendingbonds[msg.sender][bonding] = 0;
        emit KeeperBonded(msg.sender, block.number, block.timestamp, bonds[msg.sender][bonding]);
    }

    /**
     * @notice begin the unbonding process to stop being a keeper
     * @param bonding the asset being unbound
     * @param amount allows for partial unbonding
     */
    function unbond(address bonding, uint amount) external {
        unbondings[msg.sender][bonding] = now.add(UNBOND);
        _unbond(bonding, msg.sender, amount);
        partialUnbonding[msg.sender][bonding] = partialUnbonding[msg.sender][bonding].add(amount);
        emit KeeperUnbonding(msg.sender, block.number, unbondings[msg.sender][bonding], amount);
    }

    /**
     * @notice withdraw funds after unbonding has finished
     * @param bonding the asset to withdraw from the bonding pool
     */
    function withdraw(address bonding) external {
        require(unbondings[msg.sender][bonding] != 0 && unbondings[msg.sender][bonding] < now, "withdraw: unbonding");
        emit KeeperUnbound(msg.sender, block.number, block.timestamp, partialUnbonding[msg.sender][bonding]);
        partialUnbonding[msg.sender][bonding] = 0;
    }
}