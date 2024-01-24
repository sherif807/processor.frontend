import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const ImageSlider = ({ imageResults, selectedImages, toggleImageSelection }) => {
    return (
        <div className="grid grid-cols-4 gap-4 py-2"> {/* Updated to grid layout */}
            {imageResults.map((image, index) => (
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
    );
};

export default ImageSlider;
