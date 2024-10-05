const {expect}  = require('chai');
const {ethers} = require('hardhat');

describe("Forge contract", () => {
    let forge;
    let accounts;
    let owner;

    beforeEach(async () => {
        let myTokenContractFactory = await ethers.getContractFactory("MyToken");
        let myToken =  await myTokenContractFactory.deploy();

        let forgeContractFactory = await ethers.getContractFactory("Forge");
        forge = await forgeContractFactory.deploy(myToken.target);
        accounts = await ethers.getSigners();
        owner = accounts[0].address;
    })

    // If the constructor is private or public, the test for it automatically gets tested if you call a function that calls other contract's function
    describe("Mint", () => {
        it("should mint the NFT", async () => {
            let tx = await forge.mintNFT(0);
            tx.wait();

            let balance = await forge.balanceOf(owner, 0);
            expect(balance).to.be.equal(1);
        })
    })

    describe("Token URI", () => {
        it("should return the correct token URI", async () => {
            let tx = await forge.tokenURI(0);
            expect(tx).to.be.equal("ipfs://QmamvwMeif9U61uAcGwcaLdw5STZdyySQoWjkrPBXzkdHf/0");
        })
    })

    describe("Forge NFT", () => {
        it("should forge NFT", async () => {
            let tx = await forge.mintNFT(0);
            tx.wait();

            let tx2 = await forge.mintNFT(1);
            tx2.wait();

            let forgeNFT = await forge.forgeNFT(3);
            forgeNFT.wait();

            expect(await forge.balanceOf(owner, 3)).to.be.equal(1);
        })
    })

    describe("Trade NFT", () => {
        it("should trade third NFT for 1st", async () => {
            let tx = await forge.mintNFT(0);
            tx.wait();

            let tx2 = await forge.mintNFT(1);
            tx2.wait();

            let forgeNFT = await forge.forgeNFT(3);
            forgeNFT.wait();

            expect(await forge.balanceOf(owner, 3)).to.be.equal(1);

            let trade = await forge.tradeNFT(3, 1);
            trade.wait();

            expect(await forge.balanceOf(owner, 3)).to.be.equal(0);
            expect(await forge.balanceOf(owner, 1)).to.be.equal(1);
        })
    })

    describe("Burn NFT", () => {
        it("should burn NFT count by 1", async () => {
            let tx = await forge.mintNFT(0);
            tx.wait();

            expect(await forge.balanceOf(owner, 0)).to.be.equal(1);

            let txBurn = await forge.burn(0, 1);

            expect(await forge.balanceOf(owner, 0)).to.be.equal(0);

        })
    })
})