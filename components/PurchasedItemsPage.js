import { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CompletedDataAnalytics, LiveDataAnalytics, CompletedGraphsVisualization, LiveGraphsVisualization } from './DataVisualization'; // Importing DataVisualization and GraphsVisualization
import EbayListingView from './EbayListingView';
import { useAbly } from '../hooks/useAbly';
import { XMarkIcon, CheckIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

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
        const response = await fetch(`${apiUrl}/api/pictures?&order[uploadedAt]=desc&purchased=1&page=${page}`);
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
        body: JSON.stringify({ purchased: false }),
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {pictures.map((picture) => (
        <div key={picture.id} className="border rounded-md shadow-md p-4 relative">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/pictures/${picture.filename}`}
            alt={picture.filename}
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-2">

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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border-t border-gray-200 mt-4 relative">
      <button
        className="w-full text-left text-gray-700 font-semibold py-2 hover:bg-gray-100 focus:outline-none flex items-center space-x-2"
        onClick={toggleExpand}
      >
        <span>{item.searchString}</span>

        {/* Conditionally render the CheckIcon if analytics exists */}
        {analytics && (
          <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
        )}
      </button>

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

      {/* Live Slide */}
      <div key="live" className="p-0">
        <LiveDataAnalytics analytics={analytics} />
        <EbayListingView data={item.prices?.ebayLiveData} />
        <LiveGraphsVisualization data={item.prices?.ebayLiveData} liveUrl={item.links?.liveUrl} />
      </div>
    </Slider>
  );
}
