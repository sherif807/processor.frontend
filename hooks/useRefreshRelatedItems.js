import { useState } from 'react';

const useRefreshRelatedItems = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshRelatedItems = async (catalogItemId, updateCatalogItem, condition) => {
    setIsRefreshing(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/get-latest-listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalogItemId, condition })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedCatalogItem = await response.json();
      updateCatalogItem(catalogItemId, { relatedItems: updatedCatalogItem.relatedItems });
        
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return { isRefreshing, refreshRelatedItems };
};

export default useRefreshRelatedItems;
