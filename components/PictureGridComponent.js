import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '../hooks/useAbly';
import { XMarkIcon, CheckIcon, ShoppingBagIcon, ClockIcon } from '@heroicons/react/24/outline';
import CatalogItem from './CatalogItem'; // Importing the CatalogItem

export default function PictureGridComponent({ page, setTotalItems }) {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);

  // Store the main image for each picture using an object
  const [mainImages, setMainImages] = useState({});

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

      dismissPicture(id);
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

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

  const setMainImage = (pictureId, image) => {
    setMainImages((prev) => ({
      ...prev,
      [pictureId]: image,
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {pictures.map((picture) => {
        const mainImage = mainImages[picture.id] || picture.filename;  // Use main image state or default to picture.filename
        return (
          <div key={picture.id} className="border rounded-md shadow-md p-4 relative">
            {/* Main Image */}
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${mainImage}`}
              alt={mainImage}
              className="w-full h-auto object-cover"
            />

            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => purchasePicture(picture.id)}
                className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 focus:outline-none"
                title="Mark as Purchased"
              >
                <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                onClick={() => pendingPicture(picture.id)}
                className="bg-yellow-500 text-white rounded-full p-1 hover:bg-yellow-600 focus:outline-none"
                title="Mark as Pending"
              >
                <ClockIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                onClick={() => dismissPicture(picture.id)}
                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                title="Dismiss"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex space-x-2">
              {/* Always include the main image as the first thumbnail */}
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${picture.filename}`}
                alt={picture.filename}
                className="w-16 h-16 object-cover cursor-pointer border border-gray-300 rounded"
                onClick={() => setMainImage(picture.id, picture.filename)}  // Set main image on click
              />

              {/* Extra Images */}
              {picture.extraImages?.length > 0 && (
                picture.extraImages.map((extraImage, index) => (
                  <img
                    key={index}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${extraImage}`}
                    alt={extraImage}
                    className="w-16 h-16 object-cover cursor-pointer border border-gray-300 rounded"
                    onClick={() => setMainImage(picture.id, extraImage)}  // Set main image on click
                  />
                ))
              )}
            </div>

            {/* Catalog Items */}
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
        );
      })}
    </div>
  );
}
