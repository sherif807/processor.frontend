import React from 'react';
import ImageSlider from './ImageSlider';
import TitleSection from './TitleSection';

const Lightbox = ({
  inputTitle, setInputTitle, imageResults, selectedImages,
  toggleImageSelection, handleSubmit, isSubmitting,
  handleGenerateTitle, getProperties, lightboxRef, isLoading
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded flex flex-col gap-4 max-w-4xl max-h-full overflow-auto relative" style={{ minWidth: '600px' }} ref={lightboxRef}>
                {/* Spinner in the top right corner */}
                {isLoading && (
                    <div className="absolute top-4 right-4">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                )}
                <TitleSection 
                    inputTitle={inputTitle} 
                    setInputTitle={setInputTitle} 
                    handleGenerateTitle={handleGenerateTitle} 
                    getProperties={getProperties} 
                />
                <ImageSlider 
                    imageResults={imageResults} 
                    selectedImages={selectedImages} 
                    toggleImageSelection={toggleImageSelection} 
                />
                <div className="flex justify-center mt-4">
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting} 
                        className="submit-button-style"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Lightbox;
