import { useState, useRef } from 'react';

export default function EbayListingView({ data, onListOneLikeThis }) {
  const listRef = useRef(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('');

  const handleMouseEnter = (index) => {
    setHoveredImageIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredImageIndex(null);
  };

  const filteredData = selectedCondition
    ? data.filter((listing) => listing.readableCondition === selectedCondition)
    : data;

  return (
    <div className="flex-1 h-[80vh] p-4 overflow-y-auto">
      {/* Dropdown for selecting condition */}
      <div className="mb-4">
        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="p-2 border rounded-md"
          style={{ width: '200px' }}
        >
          <option value="">All Conditions</option>
          <option value="Brand New">Brand New</option>
          <option value="Pre-Owned">Pre-Owned</option>
          <option value="Open Box">Open Box</option>
        </select>
      </div>

      <div ref={listRef} className="space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
        {filteredData.map((listing, index) => (
          <div
            key={index}
            className="border p-4 shadow-md flex flex-col items-start relative"
          >
            {/* Image with hover effect */}
            <div
              className="relative w-full"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className={`object-cover w-full rounded-md transition-transform duration-300 ease-in-out ${
                  hoveredImageIndex === index ? 'transform scale-105' : ''
                }`}
              />
            </div>

            {/* Title and details */}
            <div className="text-left mt-2 w-full">
              <a
                href={`https://www.ebay.com/itm/${listing.itemId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-lg font-medium block"
              >
                {listing.title}
              </a>
              <p className="text-gray-500">
                Condition: <span className="text-gray-800">{listing.readableCondition}</span>
              </p>
              <p className="text-gray-500">Price: ${listing.price}</p>
              <p className="text-gray-500">Shipping: ${listing.shippingPrice || 0}</p>
              <p className={`font-bold ${listing.soldStatus === 1 ? 'text-green-600' : 'text-red-500'}`}>
                Total Price: ${listing.totalPrice.toFixed(2)}
              </p>
              <button
                onClick={() => onListOneLikeThis(listing.title, listing.totalPrice, listing.itemId)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                List One Like This
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
