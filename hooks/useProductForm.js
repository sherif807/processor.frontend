import { useState } from 'react';

const useProductForm = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [currentCatalogItem, setCurrentCatalogItem] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageResults, setImageResults] = useState([]);



  const setCurrentItem = (catalogItem) => {
    setCurrentCatalogItem(catalogItem);
    setImageResults([]); // Clear previous images
    const itemIds = catalogItem.relatedItems.map(item => item.itemId);
    // getProperties(itemIds); // Optionally fetch properties immediately
    //setCurrentItemIds(itemIds); // Assuming you have a state for itemIds
  };

  const resetInputTitle = () => setInputTitle('');


  const generateTitle = async () => {
    const imageTitles = imageResults.map(image => image.title);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://localhost:8000/api/get-best-title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageTitles)
      });
      if (!response.ok) throw new Error('Failed to generate title');
      const result = await response.json();
      setInputTitle(result.generatedTitle);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProperties = async (itemIds) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://localhost:8000/api/get-listing-properties-from-ebay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemIds)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const getImages = async (catalogItem) => {
    setIsLoading(true);
    try {
      const query = `${catalogItem.brand} ${catalogItem.model}`;
      const response = await fetch(`https://localhost:8000/api/google-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      if (result && Array.isArray(result.results)) {
        setImageResults(result.results);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputTitle,
    setInputTitle,
    resetInputTitle,
    properties,
    isLoading,
    error,
    generateTitle,
    getProperties,
    setCurrentItem,
    imageResults,
    getImages
  };
};

export default useProductForm;
