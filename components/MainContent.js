import React, { useState, useEffect } from 'react';
import useLightbox from '../hooks/useLightbox';
import useDisplayedItems from '../hooks/useDisplayedItems';
import useRefreshRelatedItems from '../hooks/useRefreshRelatedItems';
import useProductForm from '../hooks/useProductForm';
import useAmazon from '../hooks/useAmazon';
import CatalogItem from '../components/CatalogItem';
import LightBox from '../components/Lightbox';
import ProductForm from '../components/ProductForm';
import EbayDescriptionComponent from '../components/EbayDescriptionComponent';
import GoogleShoppingPricesComponent from '../components/GoogleShoppingPricesComponent';


export default function MainContent({ data }) {
  if (!data) return <p>No data available</p>;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [catalogItems, setCatalogItems] = useState(data);
    const { displayedItems, showMoreItems, showLessItems } = useDisplayedItems(data);
    const { isRefreshing, refreshRelatedItems} = useRefreshRelatedItems();    
    const { inputTitle, setInputTitle, resetInputTitle, isLoading, error, generateTitle, currentItem, setCurrentItem, imageResults, setImageResults, getImages, handleSubmit, selectedImages, setSelectedImages,  toggleImageSelection, getHistoricalPrices, setPricingData, pricingData, listProduct ,getBestDescription, description, setDescription, prepareItem, getEbayDescription, ebayDescription, markCatalogItemChecked } = useProductForm();    
    const { listAmazonProduct } = useAmazon();
    const {lightboxVisible, openLightbox, closeLightbox, lightboxRef} = useLightbox(resetInputTitle); 
    const [lightboxContent, setLightboxContent] = useState(null);


    useEffect(() => {
      console.log(data);
      setCatalogItems(data);
  }, [data]);


    const updateCatalogItem = (catalogItemId, updatedData) => {
      setCatalogItems((prevCatalogItems) => {
        return prevCatalogItems.map(catalogItem => {
          if (catalogItem.id === catalogItemId) {
            return { ...catalogItem, ...updatedData };
          }
          return catalogItem;
        });
      });
    };
    


    const updateRelatedItem = (catalogItemId, relatedItemId, updatedData) => {
      setCatalogItems((prevCatalogItems) => {
        return prevCatalogItems.map(catalogItem => {
          if (catalogItem.id === catalogItemId) {
            return {
              ...catalogItem,
              relatedItems: catalogItem.relatedItems.map(item =>
                item.id === relatedItemId ? { ...item, ...updatedData } : item
              )
            };
          }
          return catalogItem;
        });
      });
    };
    
    


  

    const handleOpenLightboxForProduct  = (catalogItem) => {
      if(!catalogItem) return;
      setSelectedImages([]);
      setCurrentItem(catalogItem);
      setDescription(catalogItem.description);
      
      
      // Use catalogItem.images if available
      if (catalogItem.images && catalogItem.images.length > 0) {
        setImageResults(catalogItem.images.map(url => ({ link: url })));
      } else {
        // Fallback to getImages API call
        getImages(catalogItem);
      }

      setLightboxContent('product');
      openLightbox();
      if (catalogItem.title) {
        setInputTitle(catalogItem.title);
      } else {
        setInputTitle('');
      }
    };


    const handleOpenLightboxForEbayDescription = (relatedItemId) => {
      getEbayDescription(relatedItemId);
      setLightboxContent('ebay-description');
      openLightbox();
  };

  const handleOpenLightboxForGoogleData = (pricingData) => {
    setLightboxContent('google-data');
    openLightbox();
    setPricingData(pricingData);
};  


    const handleRefreshImages = () => {
      if (currentItem) {
        getImages(currentItem);
      }
    };


    const handleRefreshRelatedItems = (catalogItemId, condition) => {
      // Assuming 'condition' is a string like "All", "Pre-Owned", etc.
      // You might need to adjust the API request based on how your backend expects the data.
      refreshRelatedItems(catalogItemId, updateCatalogItem, condition);
      // Add logic to handle the condition or modify the API request accordingly
  };
    

  const removeCatalogItem = (catalogItemId) => {
    setCatalogItems(prevCatalogItems => prevCatalogItems.filter(item => item.id !== catalogItemId));
  };
  
    



  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        {catalogItems.map((catalogItem) => (
            <CatalogItem
                key={catalogItem.id}
                catalogItem={catalogItem}
                updateRelatedItem={updateRelatedItem}
                updateCatalogItem={updateCatalogItem}
                showMoreItems={showMoreItems}
                showLessItems={showLessItems}
                displayedItems={displayedItems}
                handleOpenLightBox={() => handleOpenLightboxForProduct(catalogItem)}
                handleRefreshRelatedItems={(condition) => handleRefreshRelatedItems(catalogItem.id, condition)}
                isRefreshing={isRefreshing}
                getHistoricalPrices={getHistoricalPrices}
                pricingData={pricingData}
                listProduct={listProduct}
                prepareItem={() => prepareItem(catalogItem)}
                getEbayDescription={(relatedItemId) => handleOpenLightboxForEbayDescription(relatedItemId)}
                handleOpenLightBoxForGoogle= {(pricingData) => handleOpenLightboxForGoogleData(pricingData)}
                isLoading={isLoading}
                markCatalogItemChecked={(catalogItemId, checked) => markCatalogItemChecked(catalogItemId, updateCatalogItem, removeCatalogItem, checked)}
                listAmazonProduct={listAmazonProduct}
            />
        ))}
      </div>

      {lightboxVisible && (
                <LightBox lightboxRef={lightboxRef}>
                  {lightboxContent === 'product' && (
                    <ProductForm
                        inputTitle={inputTitle}
                        setInputTitle={setInputTitle}
                        imageResults={imageResults}
                        selectedImages={selectedImages}
                        toggleImageSelection={toggleImageSelection}
                        handleSubmit={() => handleSubmit(closeLightbox, updateCatalogItem)}
                        isSubmitting={isSubmitting}
                        handleGenerateTitle={generateTitle}
                        isLoading={isLoading}
                        handleRefreshImages={handleRefreshImages}
                        getBestDescription={getBestDescription}
                        description={description}
                        setDescription={setDescription}
                    />
                  )}
                  {lightboxContent === 'ebay-description' && (
                      <EbayDescriptionComponent 
                          description={ebayDescription} 
                      />
                  )}


                  {lightboxContent === 'google-data' && (
                      <GoogleShoppingPricesComponent pricingData={pricingData} /> 
                  )}                  
                </LightBox>
            )}

    </main>
  );
}
