import { useState, useEffect } from 'react';
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline'; // Importing CheckIcon for the bring-back functionality

export default function DismissedItemsPage({ page, setTotalItems }) {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDismissedPictures = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/pictures?page=${page}&listingStatus=1`);

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

    fetchDismissedPictures();
  }, [page, setTotalItems]);
  const bringBackPicture = async (id) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/pictures/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ listingStatus: 0 }), // Set listingStatus to 0 to bring back the item
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setPictures((prevPictures) => prevPictures.filter(p => p.id !== id)); // Remove the picture from the state
    } catch (error) {
      console.error('Bring back error:', error);
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

          {/* Bring back button at the top-right of the image */}
          <button
            onClick={() => bringBackPicture(picture.id)}
            className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 hover:bg-green-600 focus:outline-none"
            title="Bring Back"
            style={{ zIndex: 10 }}
          >
            <CheckIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="mt-2 text-center text-gray-700">
            {picture.catalogItems.length > 0 ? (
              picture.catalogItems.map((item, index) => (
                <div key={item['@id']} className="border-t border-gray-200 mt-4 relative">
                  <button
                    className="w-full text-left text-gray-700 font-semibold py-2 hover:bg-gray-100 focus:outline-none"
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
