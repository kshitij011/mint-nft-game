import React, { useEffect, useState, useRef } from 'react'

function Sidebar({forge, account}) {
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(0);
    const [content, setContent] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);

    const mint = async (selectedItem) => {

        try{
            await(await forge.mintNFT(selectedItem)).wait();
            loadInfo(selectedItem);
        }catch(e){
            alert("1 minute cooldown period. Try minting again after 1 minute", e);
        }

    }

    const forgeNFT = async (selectedItem) => {
        // await(await forge.mintNFT(selectedItem)).wait();
        loadInfo(selectedItem);
    }

    const trade = async () => {
        if(selectedItem === selectedToken){
            alert("Same token selected, select different token.")
        }else{
            await (await forge.tradeNFT(selectedItem, selectedToken))
            loadInfo(selectedItem)
        }
    }

    const burn = async (selectedItem) => {
        await(await forge.burn(selectedItem, 1)).wait();
        loadInfo(selectedItem);
    }

    const handleSelectChange = (event) => {
        const newToken = Number(event.target.value);
        trade(newToken);
        setSelectedToken(newToken);
    };

    useEffect(() => {
        trade()
    }, [selectedToken])

    async function loadInfo(){
        try {
            const balance = await forge.balanceOf(account, selectedItem);

            setContent(
                <div className="bg-gray-700 w-full flex justify-around items-center">
                    <div className="bg-gray-400 w-2/3 h-3/4 flex rounded-xl">
                        <div className='bg-slate-500 w-2/3 flex items-center justify-center rounded-l-xl'>
                            <img src="https://www.w3schools.com/css/responsiveImgGallery.jpg" alt="Image" className='bg-slate-300 h-3/4 w-3/4 rounded-xl'/>
                        </div>
                        <div className="w-1/3 font-extrabold text-center overflow-hidden rounded-r-xl">
                            {selectedItem<3 ? (
                               <><div className="h-1/4 content-center bg-green-300" onClick={() => mint()}>Mint</div><hr /></>
                            ):(
                                <><div className="h-1/4 content-center bg-green-300" onClick={() => forgeNFT()}>Forge</div><hr /></>
                            )}

                            <div className="h-1/4 content-center bg-yellow-300">Balance: {balance.toString()}</div><hr/>

                            <div className="h-1/4 content-center bg-blue-300">
                                <select id="NFTs" defaultValue="" onChange={handleSelectChange} className='bg-blue-300'>
                                    <option value="" disabled>Trade this token for</option>
                                    <option value="0">Water</option>
                                    <option value="1">Soil</option>
                                    <option value="2">Fire</option>
                                </select>
                            </div>

                            <div className="h-1/4 content-center bg-red-400" onClick={()=>burn()}>Burn</div>

                        </div>
                    </div>
                </div>
            );

            setLoading(false);
        } catch (error) {
            console.error("Error loading item info:", error);
        }
    }

    useEffect(() => {
        console.log("selected item", selectedItem);
        loadInfo(selectedItem);
    }, [selectedItem])

  return (
    <div className="flex">
        <div className="bg-gray-500 w-28 h-screen ">
            <ul className='h-full flex flex-col justify-around items-center'>
                {[...Array(7).keys()].map((itemId) => (
                    <li className='cursor-pointer' key={itemId} onClick={() => setSelectedItem(itemId)}>
                        <img src="https://www.w3schools.com/images/colorpicker2000.webp" alt="image" className='w-22 h-22' />
                    </li>
                ))}
            </ul>
        </div>

        {!loading && content}
    </div>
  )


// const [selectedOption, setSelectedOption] = useState('');
// const selectRef = useRef(null);

// // Function to handle the selection change
// const handleSelectionChange = (event) => {
//   setSelectedOption(event.target.value)
//   console.log("Selected Option: ", selectedOption);
// };

// useEffect(()=>{
//     console.log(selectedOption);
// }, [selectedOption])

// // Function that uses the selected option
// const handleButtonClick = () => {
//   alert(`You selected: ${selectedOption}`);
//   // You can add more logic here that uses the selectedOption
// };

// return (
//   <div>
//     <label htmlFor="options">Choose an option:</label>
//     <select id="options" value={selectedOption} onChange={handleSelectionChange} ref={selectRef}>
//       <option value="" disabled>Select an option</option>
//       <option value="option1">Option 1</option>
//       <option value="option2">Option 2</option>
//       <option value="option3">Option 3</option>
//     </select>

//     <button onClick={handleButtonClick} disabled={!selectedOption}>
//       Use Selected Option
//     </button>
//   </div>
// );


    // <div className="flex">
    //     <div className="bg-gray-500 w-28 h-screen ">
    //         <ul className=' h-full flex flex-col justify-around items-center'>
    //             <li onClick={() => setSelectedItem(0)}>0</li><hr />
    //             <li onClick={() => setSelectedItem(1)}>1</li><hr />
    //             <li onClick={() => setSelectedItem(2)}>2</li><hr />
    //             <li onClick={() => setSelectedItem(3)}>3</li><hr />
    //             <li onClick={() => setSelectedItem(4)}>4</li><hr />
    //             <li onClick={() => setSelectedItem(5)}>5</li><hr />
    //             <li onClick={() => setSelectedItem(6)}>6</li>
    //         </ul>
    //     </div>
    // </div>
}

export default Sidebar