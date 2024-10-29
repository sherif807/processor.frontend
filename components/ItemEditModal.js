import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { useEffect, useState } from 'react';

export default function ItemEditModal({
  isOpen,
  closeModal,
  itemProperties,
  setItemProperties,
  picture,
  purchasePicture, // Receive the function as a prop
}) {
  const [extraImages, setExtraImages] = useState(picture.extraImages || []);
  const [itemResultModalOpen, setItemResultModalOpen] = useState(false); // For second modal
  const [itemResult, setItemResult] = useState(null); // To hold result data (including warnings/errors)

  // Set best offer enabled and default shipping if not already set
  useEffect(() => {
    if (itemProperties && itemProperties.best_offer_enabled === undefined) {
      setItemProperties({ ...itemProperties, best_offer_enabled: true });
    }
    if (itemProperties && itemProperties.shipping_profile_id === undefined) {
      setItemProperties({ ...itemProperties, shipping_profile_id: '230456061025' }); // Default to USPS
    }
  }, [itemProperties, setItemProperties]);

  const handleConditionChange = (e) => {
    setItemProperties({ ...itemProperties, condition: e.target.value });
  };

  const handleQuantityChange = (e) => {
    setItemProperties({ ...itemProperties, quantity: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setItemProperties({ ...itemProperties, description: e.target.value });
  };

  const handleBestOfferChange = (e) => {
    setItemProperties({ ...itemProperties, best_offer_enabled: e.target.checked });
  };

  const handleShippingChange = (e) => {
    setItemProperties({ ...itemProperties, shipping_profile_id: e.target.value });
  };

  // Function to remove an image
  const handleRemoveImage = (index) => {
    const updatedImages = extraImages.filter((_, i) => i !== index);
    setExtraImages(updatedImages);
  };

  // Function to send item details to the backend and list the item on eBay
  const handleListItem = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const itemData = {
      ...itemProperties,
      images: [
        `${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${picture.filename}`,
        ...extraImages.map((image) => `${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${image}`),
      ],
    };

    try {
      const response = await fetch(`${apiUrl}/api/list-ebay-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData), // Sending the item properties to the backend
      });

      if (!response.ok) {
        throw new Error('Failed to list the item');
      }

      const result = await response.json();
      setItemResult(result); // Store the result to show in the second modal
      console.log('Item successfully listed:', result);

      // Close the current modal and open the result modal
      closeModal();
      setItemResultModalOpen(true);

      // Call purchasePicture with the picture ID if listing was successful
      if (result.ItemID) {
        purchasePicture(picture.id); // Ensure `picture.id` is the correct identifier
      }
    } catch (error) {
      console.error('Error listing the item:', error);
      setItemResult({
        Ack: 'Failure',
        Errors: {
          ShortMessage: error.message,
          LongMessage: error.message,
          ErrorCode: '99999',
          SeverityCode: 'Error',
        },
      });
      closeModal();
      setItemResultModalOpen(true);
    }
  };

  const customModalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Darker overlay
    },
    modal: {
      maxWidth: '80%', // Reduce width by 20%
      width: '80%',
      height: '80%', // Reduce height by 20%
      padding: '0', // Remove padding
    },
  };

  return (
    <>
      {/* Initial modal to list the item */}
      <Modal open={isOpen} onClose={closeModal} center={false} styles={customModalStyles}>
        {itemProperties ? (
          <div className="flex h-[80vh] w-[80vw]">
            {/* Left: Item Properties Form */}
            <div className="w-1/2 p-8 overflow-auto">
              <h2 className="text-xl font-bold mb-4">Item Properties</h2>

              {/* Title Field */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Title (max 80 characters)</label>
                <input
                  type="text"
                  value={itemProperties.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    if (title.length <= 80) {
                      setItemProperties({ ...itemProperties, title });
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-sm text-gray-500">{itemProperties.title.length}/80 characters</p>
              </div>

              {/* Condition Dropdown */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Condition</label>
                <select
                  value={itemProperties.condition}
                  onChange={handleConditionChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={1000}>New</option>
                  <option value={1500}>Open box</option>
                  <option value={3000}>Used</option>
                </select>
              </div>

              {/* Price Field */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Price</label>
                <input
                  type="number"
                  value={itemProperties.price}
                  onChange={(e) => setItemProperties({ ...itemProperties, price: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Quantity Field */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Quantity</label>
                <input
                  type="number"
                  value={itemProperties.quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  value={itemProperties.description}
                  onChange={handleDescriptionChange}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                />
              </div>

              {/* Shipping Dropdown */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Shipping Method</label>
                <select
                  value={itemProperties.shipping_profile_id}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="230456061025">USPS Free Shipping</option>
                  <option value="230455418025">FedEx Ground Free Shipping</option>
                </select>
              </div>

              {/* Best Offer Enabled Checkbox */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">
                  <input
                    type="checkbox"
                    checked={itemProperties.best_offer_enabled}
                    onChange={handleBestOfferChange}
                    className="mr-2"
                  />
                  Best Offer Enabled
                </label>
              </div>

              {/* List Item Button */}
              <button
                onClick={handleListItem} // Calls the backend to list the item
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                List Item
              </button>
            </div>

            {/* Right: Images */}
            <div className="w-1/2 p-8 overflow-auto bg-gray-100">
              <h2 className="text-xl font-bold mb-4">Images</h2>
              <div className="flex flex-col gap-4">
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${picture.filename}`}
                    alt={picture.filename}
                    className="w-full object-cover cursor-pointer border border-gray-300 rounded"
                  />
                </div>
                {/* Extra Images */}
                {extraImages.map((extraImage, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${extraImage}`}
                      alt={extraImage}
                      className="w-full object-cover cursor-pointer border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>

      {/* Second modal to show the listing result */}
      <Modal open={itemResultModalOpen} onClose={() => setItemResultModalOpen(false)} center={true}>
        {itemResult ? (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Listing Result</h2>

            {/* Item ID */}
            {itemResult.ItemID ? (
              <p className="mb-2 text-green-600">Item ID: {itemResult.ItemID}</p>
            ) : (
              <p className="mb-2 text-red-600">Failed to list the item.</p>
            )}

            {/* Display warnings or errors */}
            {itemResult.Errors && Array.isArray(itemResult.Errors) && (
              <div>
                {itemResult.Errors.map((error, index) => (
                  <p
                    key={index}
                    className={
                      error.SeverityCode === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                    }
                  >
                    {error.ShortMessage}
                  </p>
                ))}
              </div>
            )}

            {itemResult.Errors && !Array.isArray(itemResult.Errors) && (
              <p
                className={
                  itemResult.Errors.SeverityCode === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                }
              >
                {itemResult.Errors.ShortMessage}
              </p>
            )}

            {/* Display fees */}
            {itemResult.Fees && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Fees</h3>
                <ul>
                  {itemResult.Fees.Fee.map((fee, index) => (
                    <li key={index} className="text-gray-600">
                      {fee.Name}: ${fee.Fee}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Other information */}
            {itemResult.StartTime && (
              <p className="text-gray-600">Start Time: {itemResult.StartTime}</p>
            )}
            {itemResult.EndTime && (
              <p className="text-gray-600">End Time: {itemResult.EndTime}</p>
            )}
          </div>
        ) : (
          <div>Loading result...</div>
        )}
      </Modal>
    </>
  );
}
