import { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAbly } from '../hooks/useAbly';
import { LinkIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Importing LinkIcon and XMarkIcon from heroicons

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
        const response = await fetch(`${apiUrl}/api/pictures?page=${page}&listingStatus=0`); // Ensure listingStatus=0 is included
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
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

  const dismissPicture = async (id) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/pictures/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ listingStatus: 1 }), // Set listingStatus to 1
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setPictures((prevPictures) => prevPictures.filter(p => p.id !== id)); // Remove the picture from the state
    } catch (error) {
      console.error('Dismiss error:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {pictures.map((picture) => (
        <div key={picture.id} className="border rounded-md shadow-md p-4 relative"> {/* Added relative positioning */}
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/pictures/${picture.filename}`}
            alt={picture.filename}
            className="w-full h-auto object-cover"
          />
          
          {/* Dismiss button at the top-right of the image */}
          <button
            onClick={() => dismissPicture(picture.id)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
            title="Dismiss"
            style={{ zIndex: 10 }}
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="mt-2 text-center text-gray-700">
            {picture.catalogItems.length > 0 ? (
              picture.catalogItems.map((item, index) => (
                <CatalogItem
                  key={item['@id']}
                  item={item}
                  analytics={item.analytics}
                  isFirst={index === 0} // Pass isFirst prop to determine if it is the first item
                  onDismiss={() => dismissPicture(picture.id)} // Pass dismiss function
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
        className="w-full text-left text-gray-700 font-semibold py-2 hover:bg-gray-100 focus:outline-none"
        onClick={toggleExpand}
      >
        {item.searchString}
      </button>

      {item.links?.liveUrl && (
        <a
          href={item.links.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-2 top-2 text-blue-500 hover:text-blue-700"
          style={{ zIndex: 10 }}
        >
          <LinkIcon className="h-5 w-5" aria-hidden="true" />
        </a>
      )}

      {isExpanded && analytics && (
        <div className="pl-4 pr-4 pb-2 text-sm text-gray-600">
          <AnalyticsSlider analytics={analytics} />
        </div>
      )}
    </div>
  );
}

function AnalyticsSlider({ analytics }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const conditions = ['new', 'pre-owned'];

  const getInitialCondition = (analytics) => {
    const numberOfNewItemsSold = analytics?.ebayAnalytics?.completed['new']?.count || 0;
    const numberOfPreOwnedItemsSold = analytics?.ebayAnalytics?.completed['pre-owned']?.count || 0;
    const numberOfNewLiveItems = analytics?.ebayAnalytics?.live['new']?.count || 0;
    const numberOfPreOwnedLiveItems = analytics?.ebayAnalytics?.live['pre-owned']?.count || 0;

    if (numberOfNewItemsSold > numberOfPreOwnedItemsSold) {
      return 'new';
    } else if (numberOfPreOwnedItemsSold > numberOfNewItemsSold) {
      return 'pre-owned';
    } else {
      if (numberOfNewLiveItems > numberOfPreOwnedLiveItems) {
        return 'new';
      } else {
        return 'pre-owned';
      }
    }
  };

  const initialCondition = getInitialCondition(analytics);
  const initialSlideIndex = conditions.indexOf(initialCondition);

  return (
    <Slider {...settings} initialSlide={initialSlideIndex}>
      {conditions.map((condition) => {
        const completedData = analytics?.ebayAnalytics?.completed[condition];
        const liveData = analytics?.ebayAnalytics?.live[condition];

        return (
          <div key={condition} className="p-4">
            <h3 className="text-lg font-bold">{condition}</h3>
            <div className="mt-2">
              <p><strong>Average Price: </strong> {completedData ? `$${completedData.averageSoldPrice.toFixed(2)}` : 'N/A'}</p>
              <p><strong>Competition: </strong> {liveData ? liveData.count : 'N/A'}</p>
              <p><strong>Selling speed: </strong> {completedData ? completedData.salesFrequencyPerWeek.toFixed(2) : 'N/A'} sales/week</p>
              <p><strong>Lowest live price:</strong> {liveData ? `$${liveData.minPrice}` : 'N/A'}</p>
              <p><strong>Number of unsold listings:</strong> {completedData ? completedData.numberOfItemsNotSold : 'N/A'}</p>
              <p><strong>Sold vs unsold %:</strong> {completedData ? `${((completedData.numberOfItemsSold / completedData.numberOfItems) * 100).toFixed(2)}%` : 'N/A'}</p>
              <p><strong>Average Days to sell:</strong> {completedData && completedData.salesFreshness ? `${completedData.salesFreshness.averageDaysToSell.toFixed(2)} days` : 'N/A'}</p>
              <p><strong>Freshness score:</strong> {completedData && completedData.salesFreshness ? `${completedData.salesFreshness.salesFreshnessScore}` : 'N/A'}</p>
            </div>
          </div>
        );
      })}
    </Slider>
  );
}
