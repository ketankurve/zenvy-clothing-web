// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZenvyLedger
 * @notice Immutable supply-chain audit log for Zenvy.
 *         Each block stores the same fields the old Java service stored,
 *         linked by SHA-256 hash chain. The frontend expects
 *         block.data = { action, details, relatedId, location } so we
 *         expose those as first-class fields.
 */
contract ZenvyLedger {
    struct Block {
        uint256 index;
        uint256 timestamp;
        string  action;
        string  details;
        string  relatedId;
        string  location;
        bytes32 previousHash;
        bytes32 hash;
    }

    Block[] private chain;

    event BlockAdded(
        uint256 indexed index,
        bytes32 hash,
        string  action,
        string  relatedId
    );

    constructor() {
        bytes32 genesisHash = _hash(0, block.timestamp, "SYSTEM_START", "Genesis block", "", "", bytes32(0));
        chain.push(Block({
            index: 0,
            timestamp: block.timestamp,
            action: "SYSTEM_START",
            details: "Genesis block",
            relatedId: "",
            location: "",
            previousHash: bytes32(0),
            hash: genesisHash
        }));
        emit BlockAdded(0, genesisHash, "SYSTEM_START", "");
    }

    function addBlock(
        string calldata action,
        string calldata details,
        string calldata relatedId,
        string calldata location
    ) external returns (bytes32) {
        Block storage last = chain[chain.length - 1];
        uint256 idx = chain.length;
        uint256 ts  = block.timestamp;
        bytes32 h   = _hash(idx, ts, action, details, relatedId, location, last.hash);

        chain.push(Block({
            index: idx,
            timestamp: ts,
            action: action,
            details: details,
            relatedId: relatedId,
            location: location,
            previousHash: last.hash,
            hash: h
        }));
        emit BlockAdded(idx, h, action, relatedId);
        return h;
    }

    function getChainLength() external view returns (uint256) {
        return chain.length;
    }

    function getBlock(uint256 i) external view returns (Block memory) {
        require(i < chain.length, "Out of range");
        return chain[i];
    }

    function getChain() external view returns (Block[] memory) {
        return chain;
    }

    function _hash(
        uint256 _index,
        uint256 _ts,
        string memory _action,
        string memory _details,
        string memory _relatedId,
        string memory _location,
        bytes32 _prev
    ) internal pure returns (bytes32) {
        return sha256(abi.encodePacked(_index, _ts, _action, _details, _relatedId, _location, _prev));
    }
}