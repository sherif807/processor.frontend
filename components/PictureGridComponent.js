import { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CompletedDataAnalytics, LiveDataAnalytics, CompletedGraphsVisualization, LiveGraphsVisualization } from './DataVisualization';
import EbayListingView from './EbayListingView';
import { useAbly } from '../hooks/useAbly';
import { XMarkIcon, CheckIcon, ShoppingBagIcon, ClockIcon } from '@heroicons/react/24/outline';
import CommentsComponent from './CommentsComponent';

export default function PictureGridComponent({ page, setTotalItems }) {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);

  useAbly('signal', (message) => {
    if (message.name === 'update') {
      const pictureId = message.data.message;
      fetchUpdatedPicture(pictureId);
    }
  });

  const fetchUpdatedPicture = useCallback(async (id) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/pictures/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedPicture = await response.json();

      setPictures((prevPictures) => {
        const index = prevPictures.findIndex(p => p['@id'] === updatedPicture['@id']);
        if (index !== -1) {
          const newPictures = [...prevPictures];
          newPictures[index] = updatedPicture;
          return newPictures;
        }
        return [...prevPictures, updatedPicture];
      });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }, []);

  useEffect(() => {
    const fetchPictures = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/pictures?&order[uploadedAt]=desc&listingStatus=0&page=${page}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        console.log(jsonData);
        setPictures(jsonData['hydra:member']);
        setTotalItems(jsonData['hydra:totalItems']);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPictures();
  }, [page, setTotalItems]);

  // Function to dismiss the picture from the list
  const dismissPicture = async (id) => {
    setPictures((prevPictures) => prevPictures.filter(p => p.id !== id));
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/pictures/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ listingStatus: 1 }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    } catch (error) {
      console.error('Dismiss error:', error);
    }
  };

  // Function to handle the purchase action and dismiss the picture after marking as purchased
  const purchasePicture = async (id) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      // Patch request to mark the picture as purchased
      const response = await fetch(`${apiUrl}/api/pictures/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ purchased: true }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Dismiss the picture after purchase is confirmed
      dismissPicture(id);

    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  // Function to mark the picture as pending
const pendingPicture = async (id) => {
  setPictures((prevPictures) => prevPictures.filter(p => p.id !== id));
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/pictures/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({ listingStatus: 2 }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Pending error:', error);
  }
};


  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {pictures.map((picture) => (
        <div key={picture.id} className="border rounded-md shadow-md p-4 relative">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${picture.filename}`}
            alt={picture.filename}
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-2">


          <button
  onClick={() => pendingPicture(picture.id)}
  className="bg-yellow-500 text-white rounded-full p-1 hover:bg-yellow-600 focus:outline-none"
  title="Mark as Pending"
  style={{ zIndex: 10 }}
>
  <ClockIcon className="h-5 w-5" aria-hidden="true" /> {/* You can use a pending-related icon */}
</button>


          <button
              onClick={() => purchasePicture(picture.id)}
              className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 focus:outline-none"
              title="Mark as Purchased"
              style={{ zIndex: 10 }}
            >
              <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Dismiss button */}
            <button
              onClick={() => dismissPicture(picture.id)}
              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
              title="Dismiss"
              style={{ zIndex: 10 }}
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>

          </div>

          <div className="mt-2 text-center text-gray-700">
            {picture.catalogItems.length > 0 ? (
              picture.catalogItems.map((item, index) => (
                <CatalogItem
                  key={item['@id']}
                  item={item}
                  analytics={item.analytics}
                  isFirst={index === 0}
                  onDismiss={() => dismissPicture(picture.id)}
                />
              ))
            ) : (
              <p>No catalog items found</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CatalogItem({ item, analytics, isFirst, onDismiss }) {
  const [isExpanded, setIsExpanded] = useState(isFirst);
  const [quantity, setQuantity] = useState(item.quantity || 1); // Initialize from item prop
  const [whatnotStartingPrice, setWhatnotStartingPrice] = useState(item.whatnotStartingPrice || 0); // Initialize from item prop
  const [searchString, setSearchString] = useState(item.searchString || ''); // Add searchString state

  const [quantityChanged, setQuantityChanged] = useState(false); // Visual indicator for quantity change
  const [priceChanged, setPriceChanged] = useState(false); // Visual indicator for price change
  const [titleChanged, setTitleChanged] = useState(false); // Visual indicator for title change
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Track editing state
  const [itemCondition, setItemCondition] = useState(item.itemCondition || 1000); 
  const [conditionChanged, setConditionChanged] = useState(false); 





  // Check if whatnotStartingPrice is being fetched properly on reload
  // useEffect(() => {
  //   setWhatnotStartingPrice(item.whatnotStartingPrice || ''); // Ensure price is set from backend properly
  // }, [item.whatnotStartingPrice]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    setQuantityChanged(true); // Show indicator when quantity changes
    await patchCatalogItem({ quantity: newQuantity });

    // Hide the checkmark after 2 seconds
    setTimeout(() => {
      setQuantityChanged(false);
    }, 2000);
  };

  const handleStartingPriceBlur = async () => {
    if (whatnotStartingPrice !== '') {
      setPriceChanged(true); // Show indicator when price changes
      await patchCatalogItem({ whatnotStartingPrice: parseFloat(whatnotStartingPrice) }); // Ensure float type
  
      // Hide the checkmark after 2 seconds
      setTimeout(() => {
        setPriceChanged(false);
      }, 2000);
    }
  };
  

  const handleConditionChange = async (e) => {
    const newCondition = parseInt(e.target.value);
    setItemCondition(newCondition);
    setConditionChanged(true); 
    await patchCatalogItem({ itemCondition: newCondition });

    setTimeout(() => {
      setConditionChanged(false);
    }, 2000);
  };

  const handleTitleBlur = async () => {
    // Make sure to patch the new title to the backend if it has changed
    if (searchString !== item.searchString) {
      setTitleChanged(true); // Show indicator when title changes
      await patchCatalogItem({ searchString }); // Update the backend
      setTimeout(() => {
        setTitleChanged(false); // Hide the checkmark after 2 seconds
      }, 2000);
    }
    setIsEditingTitle(false); // Return to normal view
  };

  const patchCatalogItem = async (data) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/catalog_items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to patch catalog item');
      }
    } catch (error) {
      console.error('Patch error:', error);
    }
  };

  return (
    <div className="border-t border-gray-200 mt-4 relative">
      <button
        className="w-full text-left text-gray-700 font-semibold py-2 hover:bg-gray-100 focus:outline-none flex flex-col space-y-2"
        onClick={toggleExpand}
      >
<div className="flex items-center space-x-2 w-full"> {/* Ensure the parent is full width */}
  {isEditingTitle ? (
    <input
      type="text"
      value={searchString}
      onChange={(e) => setSearchString(e.target.value)} // Update searchString
      onBlur={handleTitleBlur} // Call API on blur
      className="border rounded p-1 text-sm flex-grow" // Use flex-grow to take available space
      placeholder="Edit Title"
      autoFocus
    />
  ) : (
    <span onClick={() => setIsEditingTitle(true)} className="cursor-pointer">
      {searchString}
    </span>
  )}
  {/* Show checkmark when title is changed */}
  {titleChanged && <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />}
</div>




        {/* Quantity dropdown */}
        <div className="mt-2">
          <label htmlFor={`quantity-${item.id}`} className="block text-xs text-gray-500">Quantity:</label>
          <select
            id={`quantity-${item.id}`}
            value={quantity}
            onChange={handleQuantityChange}
            className="border rounded p-1 text-sm"
            style={{ width: '100px' }}  // Adjust this width as needed
          >
            {[...Array(10).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>

          {/* Show checkmark when quantity is changed */}
          {quantityChanged && <CheckIcon className="h-5 w-5 text-green-500 inline-block ml-2" aria-hidden="true" />}
        </div>

        <div className="mt-2">
          <label htmlFor={`condition-${item.id}`} className="block text-xs text-gray-500">Item Condition:</label>
          <select
            id={`condition-${item.id}`}
            value={itemCondition}
            onChange={handleConditionChange}
            className="border rounded p-1 text-sm"
            style={{ width: '150px' }}  // Adjust this width as needed
          >
            <option value={1000}>New</option>
            <option value={1500}>Open Box</option>
            <option value={3000}>Used</option>
          </select>
          {conditionChanged && <CheckIcon className="h-5 w-5 text-green-500 inline-block ml-2" aria-hidden="true" />}
        </div>    

      </button>


      <div className="col-span-3">
          <CommentsComponent itemId={item.id} />
        </div>

      {isExpanded && analytics && (
        <div className="pl-0 pr-0 pb-2 text-sm text-gray-600">
          <AnalyticsSlider analytics={analytics} item={item} />
        </div>
      )}
    </div>
  );
}

function AnalyticsSlider({ analytics, item }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <Slider {...settings}>
      <div key="history" className="p-0">
        <CompletedDataAnalytics analytics={analytics} completedUrl={item.links?.completedUrl} />
        <EbayListingView data={item.prices?.ebayCompletedData} />
        <CompletedGraphsVisualization data={item.prices?.ebayCompletedData} completedUrl={item.links?.completedUrl} />
      </div>
      <div key="live" className="p-0">
        <LiveDataAnalytics analytics={analytics} />
        <EbayListingView data={item.prices?.ebayLiveData} />
        <LiveGraphsVisualization data={item.prices?.ebayLiveData} liveUrl={item.links?.liveUrl} />
      </div>
    </Slider>
  );
}
