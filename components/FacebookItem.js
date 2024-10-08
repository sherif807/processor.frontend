import React, { useState, useEffect } from 'react';

const FacebookItem = ({ facebookItem, listFacebookProduct, catalogItem, updateFacebookItem, getEbayDescription, selectedAsin, listAmazonProduct }) => {
    const [amazonPrice, setAmazonPrice] = useState(facebookItem.amazonListingProperties?.price || '');
    const [buttonState, setButtonState] = useState({ text: "List", color: "bg-purple-500", disabled: false });
    const [amazonButtonState, setamazonButtonState] = useState({ text: "List", color: "bg-orange", disabled: false });
    const [amazonDescription, setAmazonDescription] = useState(facebookItem.amazonListingProperties?.description || '');
    const [sellingPrice, setSellingPrice] = useState(parseFloat(facebookItem.sellingPrice));
    const [itemCondition, setItemCondition] = useState(facebookItem.itemCondition || '');

    const buttonClasses = `px-4 py-2 rounded text-white font-semibold ${buttonState.color} ${buttonState.disabled ? 'cursor-not-allowed' : 'hover:bg-opacity-80'}`;
    const amazonButtonClasses = `px-2 py-2 text-xs rounded text-white ${amazonButtonState.color} ${amazonButtonState.disabled ? 'cursor-not-allowed' : 'hover:bg-opacity-80'}`;
    
    const totalPrice = parseFloat(facebookItem.price) + parseFloat(facebookItem.shippingPrice || 0);

    const calculateInitialSellingPrice = (price) => {
        const doubledPrice = price * 2;
        return Math.ceil(doubledPrice / 100) * 100; // Round up to nearest 100
    };

    const calculateAmazonProfit = () => {
        const amazonSellingPriceAfterFees = parseFloat(amazonPrice) - (parseFloat(amazonPrice) * 0.08);
        const buyingPriceAfterTax = parseFloat(facebookItem.price) + (parseFloat(facebookItem.price) * 0.07);
        return (amazonSellingPriceAfterFees - buyingPriceAfterTax).toFixed(2);
    };

    const initialSellingPrice = calculateInitialSellingPrice(parseFloat(facebookItem.price));

    useEffect(() => {
        let newState = { ...buttonState };
        const isPriceValid = parseFloat(amazonPrice) > facebookItem.price;
        const isCatalogItemStatusValid = catalogItem.status === 1 || catalogItem.status === 2;

        switch (facebookItem.listingStatus) {
            case 0: // List
                newState = { text: "List", color: "bg-purple-500" };
                break;
            case 1: // Pending
                newState = { text: "Pending", color: "bg-gray-500", disabled: false };
                break;
            case 2: // Listed
                newState = { text: "Listed", color: "bg-green-500", disabled: true };
                break;
            case 3: // Changing Price
                newState = { text: "Changing Price", color: "bg-blue-500", disabled: !(isPriceValid && isCatalogItemStatusValid) };
                break;
            case 6: // Deleting Item
                newState = { text: "Deleting Item", color: "bg-red-500", disabled: true };
                break;
            case 7: 
                newState = { text: "In bank", color: "bg-gray-500", disabled: false };
                break;    
            case 12:
                newState = { text: "Dead", color: "bg-gray-500", disabled: true };
                break;

            default:
                // Default state or do nothing
                break;
        }
        setButtonState(newState);
    }, [facebookItem.listingStatus, sellingPrice, totalPrice, catalogItem.status]);

    const handleListClick = async () => {
        switch (facebookItem.listingStatus) {
            case 0: // List
                await listFacebookProduct(catalogItem, facebookItem.id, updateFacebookItem, sellingPrice, 1, amazonDescription, itemCondition);
                break;
            case 1: // Pending
                await listFacebookProduct(catalogItem, facebookItem.id, updateFacebookItem, 0, 0);
                break;
            case 2: // Listed
                await listFacebookProduct(catalogItem, facebookItem.id, updateFacebookItem, 0, 6);
                break;
            case 3: // Changing Price
                // Logic for changing price
                break;
            case 6: // Deleting Item
                // Logic for deleting item
                break;
            case 7: // Deleting Item
                await listFacebookProduct(catalogItem, facebookItem.id, updateFacebookItem, 0, 0);
                break;                
            default:
                // Handle other cases or do nothing
                break;
        }
    };

    const handleAmazonListClick = async () => {
        switch (relatedItem.amazonListStatus) {
            case 0: // List
                await listAmazonProduct(catalogItem, relatedItem.id, updateFacebookItem, amazonPrice, 1, selectedAsin, amazonDescription);
                break;
            case 1: // Pending
                await listAmazonProduct(catalogItem, relatedItem.id, updateFacebookItem, 0, 0, null, null);
                break;
            case 2: // Listed
                await listAmazonProduct(catalogItem, relatedItem.id, updateFacebookItem, 0, 6, null, null);
                break;
            case 3: // Changing Price
                // Logic for changing price
                break;
            case 6: // Deleting Item
                // Logic for deleting item
                break;
            case 7: // Deleting Item
                await listAmazonProduct(catalogItem, relatedItem.id, updateFacebookItem, 0, 0, null, null);
                break;                
            default:
                // Handle other cases or do nothing
                break;
        }
    };

    const handleScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentPrice = parseFloat(sellingPrice) || 0;
        const delta = e.deltaY < 0 ? 20 : -20; // Adjust price in $20 increments
        let newPrice = currentPrice + delta;

        // Ensure the price always ends in .97
        newPrice = Math.floor(newPrice) - 0.03;

        // Prevent negative prices
        if (newPrice < 0) {
            newPrice = 0;
        }

        setSellingPrice(newPrice.toFixed(2));
    };

    const disableScroll = () => {
        document.body.style.overflow = 'hidden';
    };

    const enableScroll = () => {
        document.body.style.overflow = 'visible';
    };

    const dimmedImageClass = 'opacity-50 grayscale';

    return (
        <div key={facebookItem.id} className="flex mt-6">
            <div className="relative image-container">
                <button onClick={() => getEbayDescription(facebookItem.id)} className="px-4 py-2">
                    Description
                </button>
            </div>
            <div className="flex-grow">
                <a href={`https://www.facebook.com/marketplace/item/${facebookItem.item_id}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                <div className="font-semibold text-lg">{facebookItem.title}</div>
                </a>
                <div>{facebookItem.id}</div>

                <div className="max-w-xl">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <div className="font-bold text-lg">${totalPrice.toFixed(2)}</div>

                            <div className="mt-2">
                                <label htmlFor="itemCondition" className="block text-sm font-medium text-gray-700">Condition</label>
                                <select
                                    id="itemCondition"
                                    name="itemCondition"
                                    value={itemCondition}
                                    onChange={(e) => setItemCondition(e.target.value)}
                                    className="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Condition</option>
                                    <option value="1000">New</option>
                                    <option value="1500">Open Box</option>
                                    <option value="3000">Used</option>
                                </select>
                            </div>

                            <div className="mt-4 mb-4">
                                <label htmlFor="amazonDescription" className="block text-sm font-medium text-gray-700">Small Description</label>
                                <textarea
                                    id="amazonDescription"
                                    name="amazonDescription"
                                    rows="2"
                                    className="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    placeholder="Enter Small description here..."
                                    value={amazonDescription}
                                    onChange={(e) => setAmazonDescription(e.target.value)}
                                />
                            </div>

                            {(catalogItem.status === 1 || catalogItem.status === 2) && (
                                <div>
                                    <div className="flex items-center">
                                        <input 
                                            type="number" 
                                            value={sellingPrice} 
                                            onChange={(e) => setSellingPrice(parseFloat(e.target.value))} 
                                            placeholder="Price" 
                                            className="flex-grow mr-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                            style={{ maxWidth: '40%' }} // Adjust the width as needed
                                            onWheel={handleScroll} 
                                            onMouseEnter={disableScroll} 
                                            onMouseLeave={enableScroll}
                                        />
                                        <button 
                                            onClick={handleListClick} 
                                            disabled={buttonState.disabled}
                                            className={buttonClasses}
                                        >
                                            {buttonState.text}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacebookItem;
