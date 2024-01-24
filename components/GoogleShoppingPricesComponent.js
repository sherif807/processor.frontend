import React from 'react';

const capitalizeFirstLetter = (string) => {
  if (!string) return "New";  // Default to "New" if the string is empty
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const GoogleShoppingPricesComponent = ({ pricingData }) => {
  const { refurbished, new: newItems, used } = pricingData.googleData || { refurbished: [], new: [], used: [] };

  const renderItems = (items, condition) => (
    items?.map((item, index) => (
      <a 
        key={index} 
        href={item.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block mb-4 p-2 rounded bg-gray-100"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">{item.title}</div>
          <div className="font-bold text-lg text-green-600">${item.extracted_price}</div>
        </div>
        <div className="text-sm mb-1">{item.delivery}</div>
        <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover my-2" />
        <div className="text-sm font-bold">{capitalizeFirstLetter(condition)}</div>
        <div className="text-xs text-gray-600">{item.source}</div>
      </a>
    ))
  );

  return (
    <div className="flex w-full">
      {refurbished?.length > 0 && (
        <div className="w-1/3 p-2 overflow-auto hide-scrollbar" style={{ maxHeight: '800px' }}>
          <h4 className="text-md font-bold my-2">Refurbished Items</h4>
          {renderItems(refurbished, 'refurbished')}
        </div>
      )}

      {newItems?.length > 0 && (
        <div className="w-1/3 p-2 overflow-auto hide-scrollbar" style={{ maxHeight: '800px' }}>
          <h4 className="text-md font-bold my-2">New Items</h4>
          {renderItems(newItems, 'new')}
        </div>
      )}

      {used?.length > 0 && (
        <div className="w-1/3 p-2 overflow-auto hide-scrollbar" style={{ maxHeight: '800px' }}>
          <h4 className="text-md font-bold my-2">Used Items</h4>
          {renderItems(used, 'used')}
        </div>
      )}
    </div>
  );
};

export default GoogleShoppingPricesComponent;
