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

  const forgeAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // useEffect(() => {
  //   const balance = async () => {await provider.getBalance(account);
  //   setBalance(balance);}
  //   balance();
  // }, [account]);

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
      const balance = await provider.getBalance(accounts[0])
      setBalance(balance);
      console.log("account", account);

      console.log("signer", signer);
      console.log("provider", provider);

      //loading contract
      const forge = new Contract(forgeAddress, ForgeAbi.abi, signer)
      setForge(forge);

      //switching chainId
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
      //         blockExplorerUrls: ["https://amoy.polygonscan.com/"]
      //       }]
      //     }
      //   )
      // }
      setLoading(false);
    } else {
      console.error("Please install a MetaMask or compatible wallet.");
    }
  }

  if(loading){
    return (
      <h1>...awaiting metamask connection.</h1>
    )
  }
  return (
    <>
      <Navbar balance={balance}/>
      <Sidebar forge={forge} account={account}/>
    </>
  )
}

export default App
