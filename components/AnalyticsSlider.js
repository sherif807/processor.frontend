import { useState } from 'react';
import EbayListingView from './EbayListingView';
import ItemEditModal from './ItemEditModal';

export default function AnalyticsSlider({ item, picture, purchasePicture, pendingPicture, dismissPicture }) {
  console.log('AnalyticsSlider data:', item);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemProperties, setItemProperties] = useState(null);

  // Open the modal with title, price, quantity, and condition
  const handleListOneLikeThis = (title, price, item_id) => {
    setItemProperties({
      title,
      price,
      quantity: item.quantity,
      condition: item.itemCondition,
      item_id,
      description: item.description || '',
      best_offer_enabled: item.bestOfferEnabled,
      shipping_profile_id: '230456061025', // Default value or fetched from somewhere
      sku: item.id,
    });

    setModalIsOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setItemProperties(null);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-4 overflow-hidden">
        <h2 className="text-center font-bold mb-4">Completed</h2>
        <div key="history" className="p-0 h-full">
          <EbayListingView data={item?.prices?.ebayCompletedData || []} onListOneLikeThis={handleListOneLikeThis} />
        </div>
      </div>

      <div className="w-1/2 p-4 overflow-hidden">
        <h2 className="text-center font-bold mb-4">Live</h2>
        <div key="live" className="p-0 h-full">
          <EbayListingView data={item?.prices?.ebayLiveData || []} onListOneLikeThis={handleListOneLikeThis} />
        </div>
      </div>

      {/* Modal for editing item properties */}
      <ItemEditModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        itemProperties={itemProperties}
        setItemProperties={setItemProperties}
        picture={picture}
        purchasePicture={purchasePicture} // Pass the function
      />
    </div>
  );
}
