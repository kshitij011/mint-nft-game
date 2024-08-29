// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./ERC1155.sol";

contract Forge {
    myToken public _myToken;

    constructor(address _forging) {
        _myToken = myToken(_forging);
    }

    function balanceOf(address _address, uint id) public view returns (uint) {
        return _myToken.balanceOf(_address, id);
    }

    function tokenURI(uint _tokenId) public view returns (string memory) {
        return _myToken.uri(_tokenId);
    }

    function mintNFT(uint _tokenId) public {
        require(_tokenId < 3, "Cannot mint");
        _myToken.mint(msg.sender, _tokenId);
    }

    function forgeNFT(uint _tokenId) public {
        _myToken.forge(msg.sender, _tokenId);
    }

    function tradeNFT(uint _inputToken, uint _desiredToken) public {
        _myToken.trade(msg.sender, _inputToken, _desiredToken);
    }

    function burn(uint _tokenId, uint _value) public {
        _myToken.burn(msg.sender, _tokenId, _value);
    }
}
