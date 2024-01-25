import React, { useState } from 'react';
import { CheckCircleIcon, PlusIcon } from '@heroicons/react/20/solid';

const ImageSlider = ({ imageResults, selectedImages, toggleImageSelection }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayedImages = isExpanded ? imageResults : imageResults?.slice(0, 12); // Show only the first 12 images (3 rows * 4 images)

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 py-2">
                {displayedImages.map((image, index) => (
                    <div key={index} className="relative cursor-pointer">
                        <img src={image.thumbnail} alt={image.title} className="max-h-60 w-full object-cover" onClick={() => toggleImageSelection(image.original)} />
                        {selectedImages.includes(image.original) && (
                            <div className="absolute inset-0 flex justify-center items-center" onClick={() => toggleImageSelection(image.original)}>
                                <CheckCircleIcon className="h-12 w-12 text-green-500" />
                            </div>
                        )}
                        <p className="text-sm text-center">{image.title}</p>
                    </div>
                ))}
            </div>
            {imageResults.length > 12 && !isExpanded && (
                <button className="flex items-center justify-center w-full mt-4" onClick={() => setIsExpanded(true)}>
                    <PlusIcon className="h-6 w-6 mr-2" /> Show All
                </button>
            )}
        </div>
    );
};

export default ImageSlider;
