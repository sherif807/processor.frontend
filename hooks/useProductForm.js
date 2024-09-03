import { useState, useEffect } from 'react';

const useProductForm = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [currentCatalogItem, setCurrentCatalogItem] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageResults, setImageResults] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]); 
  const [description, setDescription] = useState(''); 
  const [pricingData, setPricingData] = useState([]);
  const [ebayDescription, setEbayDescription] = useState(''); 
  const [upcData, setUpcData] = useState(null);



  const matchAmazon = async (catalogItem, updateCatalogItem) => {
    setIsLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/match-amazon-asins`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(catalogItem.id)
        });

        const updatedCatalogItem = await response.json();
        updateCatalogItem(catalogItem.id, updatedCatalogItem);
  
    } catch (error) {
        console.error('Error preparing item:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
  };  



  const prepareItem = async (catalogItem) => {
    setIsLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/prepare-item`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(catalogItem.id)
        });
  
        if (!response.ok) throw new Error('Network response was not ok');
  
        const returns = await response.json();
    } catch (error) {
        console.error('Error preparing item:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
  };


  const handleSubmit = async (closeLightbox, updateCatalogItem) => {
    setIsLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/save-final-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalogId: currentCatalogItem?.id, // Ensure currentCatalogItem is not null
          inputTitle,
          images: selectedImages,
          // videos: selectedVideos,
          description: description,
        })
      });

      const updatedCatalogItem = await response.json();
        updateCatalogItem(currentCatalogItem.id, updatedCatalogItem);
        // fetchUpdatedCatalogItem(currentCatalogItem.id);
        closeLightbox();


    } catch (error) {
      console.error('Error saving final item:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };  


  const toggleImageSelection = (imageLink) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(imageLink)) {
        return prevSelectedImages.filter((img) => img !== imageLink);
      } else {
        return [...prevSelectedImages, imageLink];
      }
    });
  };



  const setCurrentItem = (catalogItem) => {
    setCurrentCatalogItem(catalogItem);
    setImageResults([]); // Clear previous images
  };

  const resetInputTitle = () => setInputTitle('');


  const generateTitle = async () => {
    const imageTitles = imageResults.map(image => image.title);
    setIsLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/get-best-title`, {
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


  const getImages = async (catalogItem) => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const query = `${catalogItem.searchString}`;
      const response = await fetch(`${apiUrl}/api/google-images`, {
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


  const getHistoricalPrices = async (catalogItem) => {
    setIsLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/get-google-ebay-prices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(catalogItem.id)
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const returns = await response.json();
        setPricingData(returns);
    } catch (error) {
        console.error('Error fetching Google Shopping Prices:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
};

const listFacebookProduct = async (catalogItem, facebookItemId,updateFacebookItem, sellingPrice, newListingStatus, smallDescription, itemCondition) => {
  setIsLoading(true);
  setError(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  try {
      const response = await fetch(`${apiUrl}/api/list-on-hitbundle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({facebookItemId, sellingPrice, newListingStatus, smallDescription, itemCondition })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const updatedItem  = await response.json();
      // updateRelatedItem(catalogItem.id, facebookItemId, { listingStatus: updatedItem.listingStatus, sellingPrice: updatedItem.sellingPrice  });
      updateFacebookItem(catalogItem.id, facebookItemId, { listingStatus: updatedItem.listingStatus, sellingPrice: updatedItem.sellingPrice  });

  } catch (error) {
      console.error('Error listing product:', error);
      setError(error.message);
  } finally {
      setIsLoading(false);
  }
};






const listProduct = async (catalogItem, relatedItemId,updateRelatedItem, sellingPrice, newListingStatus) => {
  setIsLoading(true);
  setError(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  try {
      const response = await fetch(`${apiUrl}/api/list-on-hitbundle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({relatedItemId, sellingPrice, newListingStatus })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const updatedItem  = await response.json();
      updateRelatedItem(catalogItem.id, relatedItemId, { listingStatus: updatedItem.listingStatus, sellingPrice: updatedItem.sellingPrice  });

  } catch (error) {
      console.error('Error listing product:', error);
      setError(error.message);
  } finally {
      setIsLoading(false);
  }
};

const getBestDescription = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(`${apiUrl}/api/get-best-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catalogItemId: currentCatalogItem.id })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const generatedDescription = await response.json();
    setDescription(generatedDescription);
  } catch (error) {
    console.error('Error fetching best description:', error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};



const getEbayDescription = async (relatedItemId) => {
  setEbayDescription('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
      const response = await fetch(`${apiUrl}/api/get-ebay-description`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: relatedItemId })
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEbayDescription(data.description);
  } catch (error) {
      console.error('Error fetching description:', error);
  }
};


const markCatalogItemChecked = async (catalogItemId, updateCatalogItem,removeCatalogItem, checked) => {
  setIsLoading(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
      const response = await fetch(`${apiUrl}/api/catalog_items/`+catalogItemId, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/merge-patch+json' },
          body: JSON.stringify({ "checked" : checked })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const updatedCatalogItem = await response.json();
      removeCatalogItem(catalogItemId);

      // updateCatalogItem(catalogItemId, { checked: updatedCatalogItem.checked });
  }
  catch (error) {
      console.error('Error updating catalog item:', error);
  }
  finally {
      setIsLoading(false);
  }
}


  const handleUpcChange = async (upc) => {
    setIsLoading(true);
    setError(null);
    const catalogItemId = currentCatalogItem.id;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/update-upc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ catalogItemId, upc })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const updatedCatalogItem = await response.json();
    } catch (error) {
        console.error('Error updating UPC:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
  }


  return {
    inputTitle,
    setInputTitle,
    resetInputTitle,
    properties,
    isLoading,
    error,
    generateTitle,
    currentItem: currentCatalogItem,
    setCurrentItem,
    setImageResults,
    imageResults,
    getImages,
    handleSubmit,
    setSelectedImages,
    selectedImages,
    toggleImageSelection,
    getHistoricalPrices,
    setPricingData,
    pricingData,
    listProduct,
    listFacebookProduct,
    getBestDescription,
    setDescription,
    description,
    prepareItem,
    getEbayDescription,
    ebayDescription,
    markCatalogItemChecked,
    upcData,
    setUpcData,
    handleUpcChange, 
    matchAmazon
  };
};

export default useProductForm;
