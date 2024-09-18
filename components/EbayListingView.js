import { useState } from 'react';

export default function EbayListingView({ data }) {
  const [itemsToShow, setItemsToShow] = useState(5); // Start by showing 5 items

  const showMoreItems = () => {
    setItemsToShow((prev) => prev + 5); // Show 5 more items
  };

  const showLessItems = () => {
    setItemsToShow(5); // Reset to showing the first 5 items
  };

  return (
    <div>
      {/* Listing grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.slice(0, itemsToShow).map((listing, index) => (
          <div key={index} className="border p-4 shadow-md flex space-x-4 items-start">
            
            {/* Image */}
            <a
              href={`https://www.ebay.com/itm/${listing.itemId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-16 h-16 object-cover"
              />
            </a>
    
            {/* Title and details */}
            <div className="flex flex-col justify-start space-y-1">
              {/* Title */}
              <a
                href={`https://www.ebay.com/itm/${listing.itemId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm font-medium text-left"
              >
                {listing.title}
              </a>
    
              {/* Row with condition, price, and shipping */}
              <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                <div>
                  <p>Condition:</p>
                  <p className="text-gray-800 mt-1">{listing.readableCondition}</p>
                </div>
                <div>
                  <p>Price:</p>
                  <p
                    className={`font-semibold mt-1 ${
                      listing.soldStatus === 1 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    ${listing.price}
                  </p>
                </div>
                <div>
                  <p>Shipping:</p>
                  <p className="mt-1">${listing.shippingPrice || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less buttons */}
      {data.length > 5 && ( // Only show the buttons if there are more than 5 listings
        <div className="flex justify-center mt-4">
          {itemsToShow < data.length ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={showMoreItems}
            >
              Show More
            </button>
          ) : (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={showLessItems}
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
