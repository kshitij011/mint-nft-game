import React, { useEffect, useState } from 'react'

function Sidebar({forge, account}) {
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(0);
    const [content, setContent] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);
    const [balances, setBalances] = useState({})

    const mint = async () => {
        try{
            await(await forge.mintNFT(selectedItem)).wait();
            const newBalance = await getBalance(selectedItem);
            setBalances(prevBalances => ({
                ...prevBalances,
                [selectedItem]: newBalance
            }));
            loadInfo();
        }catch(e){
            alert("1 minute cooldown period. Try minting again after 1 minute", e);
        }
    }

    const idItems = {
        0: "Water",
        1: "Soli",
        2: "Fire",
        3: "Mud = Water + Soil",
        4: "Stone = Soil + Fire",
        5: "Vapour = Water + Fire",
        6: "Pot = Water + Soil + Fire"
    }

    const forgeNFT = async () => {
        try{
            await(await forge.forgeNFT(selectedItem)).wait();
            const newBalance = await getBalance(selectedItem);
            const tokenOne = await getBalance(0);
            const tokenTwo = await getBalance(1);
            const tokenThree = await getBalance(2);

            setBalances(prevBalances => ({
                ...prevBalances,
                [selectedItem]: newBalance,
                0: tokenOne,
                1: tokenTwo,
                2: tokenThree
            }));
            loadInfo();
        } catch(e){
            alert("Insufficient token balance to forge")
        }
    }

    const trade = async () => {
        if(selectedItem === selectedToken){
            alert("Same token selected, select different token! Ignore if selected different.")
        }else if(balances[selectedItem] == 0){
            alert(`Insufficient balance`);
        }else{
            await (await forge.tradeNFT(selectedItem, selectedToken)).wait()
            const selectedItemBal = await getBalance(selectedItem);
            const selectedTokenBal = await getBalance(selectedToken);
            // Update balances of both the tokens traded
            setBalances(prevBalances => ({
                ...prevBalances,
                [selectedItem]: selectedItemBal,
                [selectedToken]: selectedTokenBal
            }));
            loadInfo(selectedItem)
        }
    }

    const burn = async () => {
        if(balances[selectedItem]==0){
            alert("Out of balance");
        }else{
            await(await forge.burn(selectedItem, 1)).wait();
            const newBalance = await getBalance(selectedItem);
            setBalances(prevBalances => ({
                ...prevBalances,
                [selectedItem]: newBalance
            }));
        loadInfo();
        }
    }

    const handleSelectChange = (event) => {
        const newToken = Number(event.target.value);
        trade(newToken);
        setSelectedToken(newToken);
    };

    const getBalance = async (itemId) => {
        const balance = await forge.balanceOf(account, itemId);
        return balance.toString();
    }

    useEffect(() => {
        // Load balances for all items when component mounts
        const loadBalances = async () => {
            const newBalances = {};
            for (let itemId of Object.keys(idItems)) {
                newBalances[itemId] = await getBalance(itemId);
            }
            setBalances(newBalances);
            setLoading(false);
        };

        loadBalances();
    }, []);

    useEffect(() => {
        trade()
    }, [selectedToken])

    useEffect(() => {
        console.log("selected item", selectedItem);
        loadInfo(selectedItem);
    }, [selectedItem, balances])

    async function loadInfo(){
        try {

            setContent(
                <div className="h-screen w-full flex justify-around items-center">
                    <div className="backdrop-blur bg-white bg-opacity-20 w-2/3 h-3/4 flex fixed">
                        <div className='w-2/3 flex flex-col items-center justify-around'>
                            <img src={`https://bafybeifyyyoopunxk472r55puztc45m4dlurdq2lzl6vmgxfzxjzsuixly.ipfs.dweb.link/${selectedItem}.jpg`} alt="Image" className='h-3/4 w-3/4 rounded-md'/>
                            <h1 className='text-2xl font-bold text-white'>{idItems[selectedItem]}</h1>
                        </div>
                        <div className="bg-opacity-50 w-1/3 font-extrabold text-xl overflow-hidden">
                            {selectedItem<3 ? (
                               <><div className="flex items-center justify-center bg-opacity-60 h-1/4 content-center bg-green-300" onClick={() => mint()}>Mint</div><hr /></>
                            ):(
                                <><div className="flex items-center justify-center bg-opacity-60 h-1/4 content-center bg-green-300" onClick={() => forgeNFT()}>Forge</div><hr /></>
                            )}

                            <div className="flex items-center justify-center bg-opacity-60 h-1/4 content-center bg-yellow-300">Balance: {balances[selectedItem]}</div><hr/>

                            <div className="flex items-center justify-center bg-opacity-60 h-1/4 content-center bg-blue-300">
                                <select id="NFTs" value="" onChange={handleSelectChange} className='bg-blue-300'>
                                    <option value="" disabled>Trade this token for</option>
                                    <option value="0">Water</option>
                                    <option value="1">Soil</option>
                                    <option value="2">Fire</option>
                                </select>
                            </div><hr />

                            <div className="flex items-center justify-center bg-opacity-60 h-1/4 content-center bg-red-400" onClick={()=>burn()}>Burn</div>

                        </div>
                    </div>
                </div>
            );

            setLoading(false);
        } catch (error) {
            console.error("Error loading item info:", error);
        }
    }

  return (
    <div className="flex pt-12 h-full fit bg-cover">
        <div className="w-32 backdrop-blur bg-white bg-opacity-15">
            <ul className='h-full flex flex-col justify-around items-center'>
                {[...Array(7).keys()].map((itemId) => (
                    <li className='pt-1 w-5/6 cursor-pointer text-center' key={itemId} onClick={() => setSelectedItem(itemId)}>
                        <img src={`https://bafybeifyyyoopunxk472r55puztc45m4dlurdq2lzl6vmgxfzxjzsuixly.ipfs.dweb.link/${itemId}.jpg`} alt={`ItemId ${itemId}`} className='w-22 h-22 rounded-xl' value='item'/>
                        <label for='item' className='text-white w-28 font-bold '>{idItems[itemId].split(' ')[0]} <span className='text-red-500'>x {balances[itemId]}</span></label>
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
    //     <div className="bg-gray-500 w-28">
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