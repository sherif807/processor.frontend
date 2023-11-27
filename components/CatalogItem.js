import React from 'react';
import { ArrowsPointingOutIcon, ArrowPathIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid';


const CatalogItem = ({ catalogItem, showMoreItems, showLessItems, displayedItems, handleGetImages, handleRefreshRelatedItems }) => {
    
    const initialItems = 4;
    return (
        <div key={catalogItem.id} className="mb-12">
        <div className="flex items-center space-x-3">
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 text-xl font-semibold text-gray-700">
            {catalogItem.id}
        </span>
        <span className="text-2xl font-bold uppercase">{catalogItem.brand} {catalogItem.model}</span>
        <div onClick={() => handleGetImages(catalogItem)} className="ml-4 cursor-pointer">
            <ArrowsPointingOutIcon className="h-5 w-5 text-indigo-600 hover:text-indigo-700" />
        </div>
        <div onClick={() => handleRefreshRelatedItems(catalogItem.id)} className="cursor-pointer">
            <ArrowPathIcon className="h-5 w-5 text-indigo-600 hover:text-indigo-700" />
        </div>
        </div>

        <div className="ml-6">
          {catalogItem.relatedItems.slice(0, displayedItems[catalogItem.id] || initialItems).map((item) => (
            <div key={item.id} className="flex mt-6">
                <div className="relative image-container">
                    <a href={`https://www.ebay.com/itm/${item.itemId}`} target="_blank" rel="noopener noreferrer">
                    <img className="w-28 h-28 mr-6" src={item.imageUrl} alt={item.title} />
                    </a>
                    <img src={item.imageUrl} alt={item.title} className="image-hover-large" />
                </div>
              <div className="flex-grow">
                <a href={`https://www.ebay.com/itm/${item.itemId}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                  <div className="font-semibold text-lg">{item.title}</div>
                </a>
                {item.subtitle && <div className="text-md">{item.subtitle}</div>}
                <div className="max-w-xl">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-md">{item.readableItemCondition}</div>
                      <div className="font-bold text-lg">${item.price}</div>
                      <div className="text-md">
                        {item.shippingPrice === '0.00' ? 'Free Shipping' : `Shipping: $${item.shippingPrice}`}
                      </div>
                    </div>
                    <div className="text-right">
                      {item.topRatedPlus && <div className="font-medium">Top Rated Plus</div>}
                      <div className="text-md">{item.seller}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}


        {catalogItem.relatedItems.length > initialItems && (
        <div className="mt-2 flex items-center space-x-2">
            {displayedItems[catalogItem.id] && displayedItems[catalogItem.id] < catalogItem.relatedItems.length && (
            <button onClick={() => showMoreItems(catalogItem.id)} className="text-indigo-600 hover:text-indigo-800">
                <PlusCircleIcon className="h-6 w-6" />
            </button>
            )}

            {displayedItems[catalogItem.id] && displayedItems[catalogItem.id] > initialItems && (
            <button onClick={() => showLessItems(catalogItem.id)} className="text-indigo-600 hover:text-indigo-800">
                <MinusCircleIcon className="h-6 w-6" />
            </button>
            )}
        </div>
        )} 


        </div>
      </div>
    );
};

export default CatalogItem;
