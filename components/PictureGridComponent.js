import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '../hooks/useAbly';
import CatalogItem from './CatalogItem';
import AnalyticsSlider from './AnalyticsSlider';
import PictureDisplay from './PictureDisplay';

export default function PictureViewComponent({ page, setTotalItems }) {
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
        setPictures(jsonData['hydra:member']);
        setTotalItems(jsonData['hydra:totalItems']);
        console.log('Pictures:', jsonData['hydra:member']);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPictures();
  }, [page, setTotalItems]);

  // Define the purchasePicture function
  const purchasePicture = async (id) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
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

      // Update the local state
      setPictures((prevPictures) =>
        prevPictures.map((p) =>
          p.id === id ? { ...p, purchased: true } : p
        )
      );
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  // Define the dismissPicture function
  const dismissPicture = async (id) => {
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

      // Update the local state
      setPictures((prevPictures) => prevPictures.filter(p => p.id !== id));
    } catch (error) {
      console.error('Dismiss error:', error);
    }
  };

  // Define the pendingPicture function
  const pendingPicture = async (id) => {
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

      // Update the local state
      setPictures((prevPictures) => prevPictures.filter(p => p.id !== id));
    } catch (error) {
      console.error('Pending error:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-12 p-4">
      {pictures.map((picture, index) => (
        <div
          key={picture.id}
          className={`flex flex-col gap-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-6`}
        >
          <div className="flex flex-row gap-8">
            {/* Left side: CatalogItem and PictureDisplay */}
            <div className="flex flex-col w-1/4 gap-6">
              {picture.catalogItems.length > 0 ? (
                picture.catalogItems.map((item, idx) => (
                  <div key={item['@id']}>
                    <CatalogItem
                      item={item}
                      analytics={item.analytics}
                      isFirst={idx === 0}
                      onDismiss={() => dismissPicture(picture.id)}
                    />
                  </div>
                ))
              ) : (
                <p className="mt-4">No catalog items found</p>
              )}

              <div> {picture.id}</div>

              <PictureDisplay
                picture={picture}
                setPictures={setPictures}
                purchasePicture={purchasePicture}
                pendingPicture={pendingPicture}
                dismissPicture={dismissPicture}
              />
            </div>

            {/* Right side: AnalyticsSlider */}
            <div className="w-3/4">
              <AnalyticsSlider
                analytics={picture.catalogItems[0]?.analytics}
                item={picture.catalogItems[0]}
                picture={picture}
                purchasePicture={purchasePicture}
                pendingPicture={pendingPicture}
                dismissPicture={dismissPicture}
              />
            </div>
          </div>
          <hr className="my-6 border-t border-gray-300" />
        </div>
      ))}
    </div>
  );
}
