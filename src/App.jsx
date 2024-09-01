import { useState, useEffect } from 'react'
import { ethers, Contract } from 'ethers';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ForgeAbi from './contractData/Forge.json';

function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [forge, setForge] = useState({});
  const [balance, setBalance] = useState(null);

  const forgeAddress = "0xDc37d67343765561B6877B0198B0B8c92AF90045";

  useEffect(() => {
    connectMetamask();
  }, []);

  const connectMetamask = async () => {
    if (window.ethereum) {
      //connecting to metamask
      const accounts  = await window.ethereum.request({method: 'eth_requestAccounts'});
      setAccount(accounts[0]);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log("signer", signer);
      console.log("provider", provider);

      //loading contract
      const forge = new Contract(forgeAddress, ForgeAbi.abi, signer)
      setForge(forge);

      // switching chainId
      // const chainId = await provider.send("eth_chainId", []);
      // console.log(chainId);
      // if(chainId != 0x13882){
      //   alert("Switch network to polygon");
      //   await ethereum.request(
      //     {method: "wallet_addEthereumChain",
      //       params: [{
      //         chainId: "0x13882",
      //         chainName: "Amoy",
      //         rpcUrls: ["https://rpc-amoy.polygon.technology/"],
      //         nativeCurrency: {
      //           name: "MATIC",
      //           symbol: "MATIC",
      //           decimals: 18,
      //         },
      //         blockExplorerUrls: ["https://amoy.polygonscan.com"]
      //       }]
      //     }
      //   )
      // }


      //getting balance
      const balance = await provider.getBalance(accounts[0])
      setBalance(balance);
      console.log("account", account);

      setLoading(false);
    } else {
      console.error("Please install a MetaMask or compatible wallet.");
    }
  }

  if(loading){
    return (
      <h1 className="text-3xl text-gray-600 font-2xl h-lvh flex justify-center items-center">
        ...awaiting metamask connection
      </h1>
    )
  }
  return (
    <div className="bg-[url('./images/bg.jpg')] bg-cover">
      <Navbar balance={balance}/>
      <Sidebar forge={forge} account={account}/>
    </div>
  )
}

export default App

//Image credit
{/* <a href="https://www.freepik.com/free-ai-image/cyberpunk-bitcoin-illustration_236291632.htm#query=nft%20background&position=23&from_view=keyword&track=ais_hybrid&uuid=87c64d8c-5816-4440-81d5-413b6a4899d3">Image by freepik</a> */}