// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyToken is ERC1155("") {

    string public name = "Mint-NFT-Game";
    string public symbol = "MNG";

    string private _uri = "ipfs://QmamvwMeif9U61uAcGwcaLdw5STZdyySQoWjkrPBXzkdHf/";

    function uri(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(_uri, Strings.toString(id)));
    }

    uint public constant WATER = 0; // water
    uint public constant SOIL = 1; // soil
    uint public constant FIRE = 2; // fire
    uint public constant MUD = 3; // soil + water = mud
    uint public constant STONE = 4; // soil + fire = stone
    uint public constant VAPOR = 5; // water + fire = waterVapor
    uint public constant POT = 6; // water + soil + fire = pot

    // tokenId => timestamp
    mapping(uint => uint) public cooldownTime;

    // mint token with cooldown
    function mint(address _to, uint _tokenId) public {
        require(_tokenId < 3, "Cannot mint");
        // cooldown for the particular tokenId
        require(cooldownTime[_tokenId] <= block.timestamp, "Cooldown");
        _mint(_to, _tokenId, 1, "");
        cooldownTime[_tokenId] = block.timestamp + 60 seconds;
    }

    // forge two or more NFT to one.
    function forge(address _to, uint _tokenId) public {
        require(_tokenId > 2 && _tokenId < 7, "Cannot forge");
        if (_tokenId == 3) {
            _burn(_to, 0, 1);
            _burn(_to, 1, 1);
            _mint(_to, _tokenId, 1, "");
        } else if (_tokenId == 4) {
            _burn(_to, 1, 1);
            _burn(_to, 2, 1);
            _mint(_to, _tokenId, 1, "");
        } else if (_tokenId == 5) {
            _burn(_to, 0, 1);
            _burn(_to, 2, 1);
            _mint(_to, _tokenId, 1, "");

         // } else if (_tokenId == 6) {     coverage tool didn't cover for this
         // but shows 100% coverage for only else block where no condition is checked
        } else if (_tokenId == 6){
            _burn(_to, 0, 1);
            _burn(_to, 1, 1);
            _burn(_to, 2, 1);
            _mint(_to, _tokenId, 1, "");
        }
    }

    // trade any NFT for 0-2 NFT
    function trade(address _to, uint _inputToken, uint _desiredToken) public {
        require(_desiredToken < 3, "Cannot trade tokenId greater than 2");
        require(_inputToken != _desiredToken, "Same tokens");

        _burn(_to, _inputToken, 1);
        _mint(_to, _desiredToken, 1, "");
    }

    function burn(address _to, uint _tokenId, uint _value) public {
        _burn(_to, _tokenId, _value);
    }
}
