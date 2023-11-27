import { useState } from 'react';

const useRefreshRelatedItems = (setData) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUpdatedCatalogItem = async (catalogItemId) => {
    try {
      const response = await fetch(`https://localhost:8000/api/catalog_items/${catalogItemId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedCatalogItem = await response.json();
      setData((prevData) => {
        return {
          ...prevData,
          'hydra:member': prevData['hydra:member'].map((item) =>
            item.id === catalogItemId ? updatedCatalogItem : item
          ),
        };
      });
    } catch (error) {
      console.error('Error fetching updated catalog item:', error);
    }
  };

  const refreshRelatedItems = async (catalogItemId) => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`https://localhost:8000/api/get-latest-listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catalogItemId)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result === 'success') {
        await fetchUpdatedCatalogItem(catalogItemId);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return { isRefreshing, refreshRelatedItems };
};

export default useRefreshRelatedItems;
