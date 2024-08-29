import React from 'react'
import { useState } from 'react';
import { ethers } from 'ethers'

function Navbar({balance}) {
    const bal = (ethers.formatEther(balance)).toString()
  return (
    <>
        <div className="h-12 bg-slate-600 text-white">
            <ul className='flex flex-row w-full h-full justify-around items-center'>
                <li className='text-red-400 font-bold'>Forge NFT</li>
                <li>View on OpenSea</li>
                <li>View Contract Code</li>
                <li className='text-center'>
                    <div className='text-xs'>Balance</div>
                    <div className='flex' title={bal}>
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