import { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DataVisualization, GraphsVisualization } from './DataVisualization';
import { useAbly } from '../hooks/useAbly';
import { LinkIcon, XMarkIcon } from '@heroicons/react/24/outline'; 
import { Box, Typography } from '@mui/material';

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
        const response = await fetch(`${apiUrl}/api/pictures?page=${page}&listingStatus=0`); 
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
      setPictures((prevPictures) => prevPictures.filter(p => p.id !== id)); 
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
        <div key={picture.id} className="border rounded-md shadow-md p-4 relative">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/pictures/${picture.filename}`}
            alt={picture.filename}
            className="w-full h-auto object-cover"
          />
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
                <div key={index}>
                  <DataVisualization analytics={item.analytics} />
                  <GraphsVisualization completedData={item.prices.ebayCompletedData} liveData={item.prices.ebayLiveData} />
                </div>
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
