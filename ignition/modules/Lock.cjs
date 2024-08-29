const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("buildModule", (m) => {
    // Deploy the ERC1155 contract
    // const ERC1155 = m.contract("ERC1155", []);

    // Deploy the Forge contract, passing the ERC1155 contract's address
    const Forge = m.contract("Forge", [0x5FbDB2315678afecb367f032d93F642f64180aa3]);

    return { Forge };
});

// npx hardhat ignition deploy ./ignition/modules/Lock.cjs --network localhost
