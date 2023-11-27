import React, { useState } from 'react';
import useLightbox from '../hooks/useLightbox';
import useDisplayedItems from '../hooks/useDisplayedItems';
import useRefreshRelatedItems from '../hooks/useRefreshRelatedItems';
import useProductForm from '../hooks/useProductForm';
import CatalogItem from '../components/CatalogItem';
import LightBox from '../components/Lightbox';


export default function MainContent({ data, setData }) {
  if (!data) return <p>No data available</p>;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentItemIds, setCurrentItemIds] = useState([]);
    const { displayedItems, showMoreItems, showLessItems } = useDisplayedItems(data['hydra:member']);
    const { inputTitle, setInputTitle, resetInputTitle, properties, isLoading, error, generateTitle, getProperties, setCurrentItem, imageResults, getImages } = useProductForm();    
    const {lightboxVisible, selectedImages, openLightbox, toggleImageSelection, lightboxRef} = useLightbox(resetInputTitle); 
    const { isRefreshing, refreshRelatedItems } = useRefreshRelatedItems(setData);    

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Reset states after submission
    setIsSubmitting(false);
    setSelectedImages([]);
    setLightboxVisible(false);
  };
  
  const handleGetProperties = () => {
    getProperties(currentItemIds);
};

const handleOpenLightbox = (catalogItem) => {
  setCurrentItem(catalogItem);
  getImages(catalogItem);
  openLightbox();
};


  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        {data['hydra:member'].map((catalogItem) => (
            <CatalogItem
                key={catalogItem.id}
                catalogItem={catalogItem}
                showMoreItems={showMoreItems}
                showLessItems={showLessItems}
                displayedItems={displayedItems}
                handleGetImages={() => handleOpenLightbox(catalogItem)}
                handleRefreshRelatedItems={() => refreshRelatedItems(catalogItem.id)}
                isRefreshing={isRefreshing}
            />
        ))}
      </div>

      {lightboxVisible && (
                <LightBox
                inputTitle={inputTitle}
                setInputTitle={setInputTitle}
                imageResults={imageResults}
                selectedImages={selectedImages}
                toggleImageSelection={toggleImageSelection}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                handleGenerateTitle={() => generateTitle()}
                getProperties={handleGetProperties}
                lightboxRef={lightboxRef}
                isLoading={isLoading}
            />
      )}

    </main>
  );
}
