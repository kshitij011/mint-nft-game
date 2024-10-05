const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("buildModule", (m) => {
    // Deploy the MyToken contract
    const MyToken = m.contract("MyToken", []);
    console.log("MyToken contract: ", MyToken);

    // Deploy the Forge contract, passing the MyToken contract's address
    const Forge = m.contract("Forge", [MyToken]);

    return { Forge };
});

// npx hardhat ignition deploy ./ignition/modules/Lock.cjs --network localhost
