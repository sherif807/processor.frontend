import React, { useState, useEffect } from 'react';

const RelatedItem = ({ relatedItem, listProduct, catalogItem, updateRelatedItem, getEbayDescription, selectedAsin, listAmazonProduct }) =>{
    const [amazonPrice, setAmazonPrice] = useState(relatedItem.amazonListingProperties?.price);
    const [buttonState, setButtonState] = useState({ text: "List", color: "bg-purple-500", disabled: false });
    const [amazonButtonState, setamazonButtonState] = useState({ text: "List", color: "bg-purple-500", disabled: false });
    const [amazonDescription, setAmazonDescription] = useState(relatedItem.amazonListingProperties?.description);
    
    const buttonClasses = `px-4 py-2 rounded text-white font-semibold ${buttonState.color} ${buttonState.disabled ? 'cursor-not-allowed' : 'hover:bg-opacity-80'}`;
    const amazonButtonClasses = `px-4 py-2 rounded text-white font-semibold ${amazonButtonState.color} ${amazonButtonState.disabled ? 'cursor-not-allowed' : 'hover:bg-opacity-80'}`;
    
    const totalPrice = parseFloat(relatedItem.price) + parseFloat(relatedItem.shippingPrice);




    const calculateInitialSellingPrice = (price) => {
        const doubledPrice = price * 2;
        return Math.ceil(doubledPrice / 100) * 100; // Round up to nearest 100
    };

    // Set the initial selling price
    const initialSellingPrice = calculateInitialSellingPrice(parseFloat(relatedItem.price));

    const [sellingPrice, setSellingPrice] = useState(initialSellingPrice);
    

    useEffect(() => {
        let newState = { ...buttonState };
        const isPriceValid = parseFloat(sellingPrice) > relatedItem.price;
        const isCatalogItemStatusValid = catalogItem.status === 1 || catalogItem.status === 2;

        switch (relatedItem.listingStatus) {
            case 0: // List
                newState = { text: "List", color: "bg-purple-500", disabled: !(isPriceValid && isCatalogItemStatusValid) };
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
    }, [relatedItem.listingStatus, sellingPrice, totalPrice, catalogItem.status]);



    useEffect(() => {
        let newState = { ...amazonButtonState };
        const isPriceValid = parseFloat(amazonPrice) > relatedItem.price;

        switch (relatedItem.amazonListStatus) {
            case 0: // List
                newState = { text: "List on Amazon", color: "bg-purple-500", disabled: !(isPriceValid && selectedAsin) };
                break;
            case 1: // Pending
                newState = { text: "Pending", color: "bg-gray-500", disabled: false };
                break;
            case 2: // Listed
                newState = { text: "Listed", color: "bg-green-500", disabled: true };
                break;
            case 3: // Changing Price
                newState = { text: "Changing Price", color: "bg-blue-500", disabled: !(isPriceValid && selectedAsin) };
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
        setamazonButtonState(newState);
    }, [relatedItem.amazonListStatus, amazonPrice, totalPrice, selectedAsin]);    



    const handleListClick = async () => {
        switch (relatedItem.listingStatus) {
            case 0: // List
                await listProduct(catalogItem, relatedItem.id, updateRelatedItem, sellingPrice, 1);
                break;
            case 1: // Pending
                await listProduct(catalogItem, relatedItem.id, updateRelatedItem, 0, 0);
                break;
            case 2: // Listed
                await listProduct(catalogItem, relatedItem.id, updateRelatedItem, 0, 6);
                break;
            case 3: // Changing Price
                // Logic for changing price
                break;
            case 6: // Deleting Item
                // Logic for deleting item
                break;
            case 7: // Deleting Item
                await listProduct(catalogItem, relatedItem.id, updateRelatedItem, 0, 0);
                break;                
            default:
                // Handle other cases or do nothing
                break;
        }
    };


    const handleAmazonListClick = async () => {
        switch (relatedItem.amazonListStatus) {
            case 0: // List
                await listAmazonProduct(catalogItem, relatedItem.id, updateRelatedItem, amazonPrice, 1, selectedAsin, amazonDescription);
                break;
            case 1: // Pending
                await listAmazonProduct(catalogItem, relatedItem.id, updateRelatedItem, 0, 0, null, null);
                break;
            case 2: // Listed
                await listAmazonProduct(catalogItem, relatedItem.id, updateRelatedItem, 0, 6, null, null);
                break;
            case 3: // Changing Price
                // Logic for changing price
                break;
            case 6: // Deleting Item
                // Logic for deleting item
                break;
            case 7: // Deleting Item
                await listAmazonProduct(catalogItem, relatedItem.id, updateRelatedItem, 0, 0, null, null);
                break;                
            default:
                // Handle other cases or do nothing
                break;
        }
    };
    

        // Function to handle scroll to adjust price
        const handleScroll = (e) => {
            e.preventDefault();
            e.stopPropagation(); 
            const currentPrice = parseFloat(sellingPrice) || 0;
            const delta = e.deltaY < 0 ? 50 : -50; // Adjust this value as needed
            setSellingPrice(Math.max(0, currentPrice + delta).toFixed(2)); // Prevent negative prices
        };


        const disableScroll = () => {
            document.body.style.overflow = 'hidden';
        };
    
        // Function to enable window scrolling
        const enableScroll = () => {
            document.body.style.overflow = 'visible';
        };


        const dimmedImageClass = 'opacity-50 grayscale';


  
    return (
      <div key={relatedItem.id} className="flex mt-6">
          <div className="relative image-container">
              <a href={`https://www.ebay.com/itm/${relatedItem.itemId}`} target="_blank" rel="noopener noreferrer">
                  <img 
                  className={`w-28 h-28 mr-6 ${relatedItem.listingStatus === 12 ? dimmedImageClass : ''}`}
                  src={relatedItem.imageUrl} 
                  alt={relatedItem.title} />
              </a>
              <img src={relatedItem.imageUrl} alt={relatedItem.title} className="image-hover-large" />
            <button onClick={() => getEbayDescription(relatedItem.id)} className="px-4 py-2">
                Description
            </button>
          </div>
          <div className="flex-grow">
              <a href={`https://www.ebay.com/itm/${relatedItem.itemId}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                  <div className="font-semibold text-lg">{relatedItem.title}</div>
              </a>
              {relatedItem.subtitle && <div className="text-md">{relatedItem.subtitle}</div>}
              <div className="max-w-xl">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                          <div className="text-md">{relatedItem.readableItemCondition}</div>
                          <div className="font-bold text-lg">${relatedItem.price}</div>
                          {/* <div className="text-md font-bold">Total Price: ${totalPrice.toFixed(2)}</div> */}


                    {(catalogItem.status === 1 || catalogItem.status === 2) && (
                        <div>
                        <div className="flex items-center">
                            <input 
                                type="number" 
                                value={sellingPrice} 
                                onChange={(e) => setSellingPrice(e.target.value)} 
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


                        {/* <div className="flex items-center mt-2">
                            <input 
                                type="number" 
                                value={sellingPrice} 
                                onChange={(e) => setAmazonPrice(e.target.value)} 
                                placeholder="Price" 
                                className="flex-grow mr-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                style={{ maxWidth: '40%' }} // Adjust the width as needed
                                />
                            <button 
                                onClick={handleAmazonListClick} 
                                disabled={amazonButtonState.disabled}
                                className={amazonButtonClasses}
                            >
                                {amazonButtonState.text}
                            </button>
                        </div> */}
                                 
  

                      </div>
                      <div className="text-right">
                          {relatedItem.topRatedPlus && <div className="font-medium">Top Rated Plus</div>}
                          <div className="text-md">{relatedItem.seller}</div>
                          <div className="text-md">
                              {relatedItem.shippingPrice === '0.00' ? 'Free Shipping' : `Shipping: $${relatedItem.shippingPrice}`}
                          </div>
                          <div className="font-sans text-lg"> $
                            {isNaN(sellingPrice) || sellingPrice === '' || !sellingPrice
                                ? '0.00' 
                                : (parseFloat(sellingPrice) - parseFloat(relatedItem.price)).toFixed(2)}
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )};

  export default RelatedItem;