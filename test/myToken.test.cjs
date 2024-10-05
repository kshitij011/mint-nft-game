const {expect} = require("chai");
// import {expect} from "chai";
const {ethers} = require("hardhat");
// import { ethers } from "hardhat";

describe("MyToken Contract", () => {
    let contract;
    let provider;
    let accounts;

    beforeEach(async () => {
        let contractFactory = await ethers.getContractFactory("MyToken");
        contract = await contractFactory.deploy();
        provider = await ethers.provider;
        accounts = await ethers.getSigners();

    })

    describe("Mint NFT", () => {
        it("should mint NFT with specified tokenId",  async () => {
            let tx = await contract.mint(accounts[0].address, 0);
            tx.wait();

            let tokenBalance = await contract.balanceOf(accounts[0].address, 0);
            expect(tokenBalance).to.be.equal(1);
        });

        it("should revert if token Id is greater than 2", async  () => {
            await expect(contract.mint(accounts[0].address, 3)).to.be.revertedWith("Cannot mint");
        });

        it("should revert if same token is minted before a mintue", async () => {
            let tx = await contract.mint(accounts[0].address, 0);
            tx.wait();

            await expect(contract.mint(accounts[0].address, 0)).to.be.revertedWith("Cooldown")
        })
    })

    describe("Forging NFTs", () => {
        it("should forge 3rd NFT", async () => {
            let txNFT1 = await contract.mint(accounts[0].address, 0);
            txNFT1.wait();

            let txNFT2 = await contract.mint(accounts[0].address, 1);
            txNFT2.wait();

            let tx = await contract.forge(accounts[0].address, 3);
            tx.wait();

            expect(await contract.balanceOf(accounts[0].address, 3)).to.be.equal(1);
        })

        it("should forge 4th NFT", async () => {
            let txNFT1 = await contract.mint(accounts[0].address, 1);
            txNFT1.wait();

            let txNFT2 = await contract.mint(accounts[0].address, 2);
            txNFT2.wait();

            let tx = await contract.forge(accounts[0].address, 4);
            tx.wait();

            expect(await contract.balanceOf(accounts[0].address, 4)).to.be.equal(1);
        })

        it("should forge 5th NFT", async () => {
            let txNFT1 = await contract.mint(accounts[0].address, 0);
            txNFT1.wait();

            let txNFT2 = await contract.mint(accounts[0].address, 2);
            txNFT2.wait();

            let tx = await contract.forge(accounts[0].address, 5);
            tx.wait();

            expect(await contract.balanceOf(accounts[0].address, 5)).to.be.equal(1);
        })

        it("should forge 6th NFT", async () => {
            let txNFT1 = await contract.mint(accounts[0].address, 0);
            txNFT1.wait();

            let txNFT2 = await contract.mint(accounts[0].address, 1);
            txNFT2.wait();

            let txNFT3 = await contract.mint(accounts[0].address, 2);
            txNFT3.wait();

            // not showing in coverage, even if it's tested here.
            let tx = await contract.forge(accounts[0].address, 6);
            tx.wait();

            console.log("6th token balance: ", await contract.balanceOf(accounts[0].address, 6));


            expect(await contract.balanceOf(accounts[0].address, 6)).to.be.equal(1);
        })

        it("should revert if tokenId is less then 3", async () => {
            await expect(contract.forge(accounts[0].address, 2)).to.be.revertedWith("Cannot forge")
        })
    })

    describe("Trading NFTs", () => {
        it("should trade input token for desired token", async () => {
            let txNFT1 = await contract.mint(accounts[0].address, 0);
            txNFT1.wait();

            let txNFT2 = await contract.mint(accounts[0].address, 1);
            txNFT2.wait();

            let tx = await contract.forge(accounts[0].address, 3);
            tx.wait();

            let txTrade = await contract.trade(accounts[0], 3,  0);
            txTrade.wait();

            expect(await contract.balanceOf(accounts[0].address,  0)).to.be.equal(1);
        })

        it("should revert is tokenId is more than 2", async () => {
            await expect(contract.trade(accounts[0].address, 2,  3)).to.be.revertedWith("Cannot trade tokenId greater than 2")
        })

        it("should revert if both the tokenId's passed are  same", async () => {
            await expect(contract.trade(accounts[0].address, 0,  0)).to.be.revertedWith("Same tokens");
        })
    })

    describe("Burning tokens", () => {
        it("should burn minted token and return balance 0", async () =>{
            let txNFT1 = await contract.mint(accounts[0].address, 0);
            txNFT1.wait();

            let txBurn = await contract.burn(accounts[0].address, 0, 1);
            txBurn.wait();

            expect(await contract.balanceOf(accounts[0].address, 0)).to.be.equal(0)
        })
    })
})