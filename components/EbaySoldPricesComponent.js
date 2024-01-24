// EbaySoldPricesComponent.js
import React from 'react';

const EbaySoldPricesComponent = ({ pricingData }) => {

    const ebayCompletedPrices = pricingData.ebayCompletedData || [];
    return (
      <div 
        className="w-1/2 p-2 overflow-auto hide-scrollbar" 
        style={{ maxHeight: '800px' }}
      >
        <h3 className="text-lg font-bold mb-2">eBay</h3>
        {ebayCompletedPrices.map((item, index) => {
          const totalSoldPrice = (parseFloat(item.price) + parseFloat(item.shippingPrice)).toFixed(2);
          const backgroundColorClass = item.soldStatus === 1 ? "bg-green-100" : "bg-red-100"; // Green for sold, Red for not sold
  
          return (
            <a 
              key={index} 
              href={`https://www.ebay.com/itm/${item.itemId}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`block mb-4 p-2 rounded ${backgroundColorClass}`} // Applying conditional background color
            >
              <div className="font-bold">{item.title}</div>
              <div className="text-sm">${totalSoldPrice}</div>
              <div className="text-sm">{item.date}</div> {/* Removed "SOLD", kept the date */}
              <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover my-2" />
              <div className="text-sm">{item.seller}</div>
            </a>
          );
        })}
      </div>
    );
  };
  
  export default EbaySoldPricesComponent;
  