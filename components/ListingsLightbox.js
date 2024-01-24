import React from 'react';
import GoogleShoppingPricesComponent from './GoogleShoppingPricesComponent';
import EbaySoldPricesComponent from './EbaySoldPricesComponent';

const ListingsLightbox = ({ content, onClose }) => {
  let contentToDisplay;

  switch (content.type) {
    case 'googlePrices':
      contentToDisplay = <GoogleShoppingPricesComponent googlePrices={content.data} />;
      break;
    case 'ebayPrices':
      contentToDisplay = <EbaySoldPricesComponent ebayCompletedPrices={content.data} />;
      break;
    // ... handle other types ...
    default:
      contentToDisplay = <div>No content selected</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded flex flex-col gap-4 max-w-4xl max-h-full overflow-auto relative" style={{ minWidth: '600px' }}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{content.title}</h2>
          <button onClick={onClose} className="text-black">
            Close
          </button>
        </div>
        <div>
          {contentToDisplay}
        </div>
      </div>
    </div>
  );
};

export default ListingsLightbox;
