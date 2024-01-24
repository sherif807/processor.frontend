import { useState, useEffect } from 'react';

const useAmazon = () => {

  const listAmazonProduct = async (catalogItem, relatedItemId, updateRelatedItem, amazonPrice, newListingStatus, asin, asinDescription) => {
    // setIsLoading(true);
    // setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    asinDescription = {};
  
  
    try {
        const response = await fetch(`${apiUrl}/api/list-on-amazon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({relatedItemId, amazonPrice, newListingStatus, asin, asinDescription })
        });
  
        if (!response.ok) throw new Error('Network response was not ok');
  
        const updatedItem  = await response.json();
        console.log(updatedItem.amazonListStatus)
        updateRelatedItem(catalogItem.id, relatedItemId, { amazonListStatus: updatedItem.amazonListStatus });
  
    } catch (error) {
        console.error('Error listing product:', error);
        // setError(error.message);
    } finally {
        // setIsLoading(false);
    }
  };



  return {
    listAmazonProduct
  };
};

export default useAmazon;
