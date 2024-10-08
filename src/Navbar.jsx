import React from 'react'
import { ethers } from 'ethers'

function Navbar({balance}) {
    const bal = (ethers.formatEther(balance)).toString()
  return (
    <>
        <div className="h-12 backdrop-blur-xl bg-black bg-opacity-10  z-10 text-white fixed w-full">
            <ul className='flex flex-row w-full h-full justify-around items-center'>
                <li className='text-red-400 font-bold'>Forge NFT</li>
                <a href="https://testnets.opensea.io/collection/mint-nft-game-3"><li>View on OpenSea</li></a>
                <a href="https://github.com/kshitij011/mint-nft-game/tree/master"><li>GitHub</li></a>
                <li className='text-center'>
                    <div className='text-xs'>Balance</div>
                    <div className='flex' title={`${bal} MATIC`}>
                        <div className='overflow-hidden h-6 w-20 font-xs font-semibold text-green-400'>{bal}</div>
                        <div className='font-semibold text-gray-300'>Matic</div>
                    </div>
                </li>
            </ul>
        </div>
    </>
  )
}

export default Navbar