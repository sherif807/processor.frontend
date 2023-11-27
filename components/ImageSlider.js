import React, { useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

const ImageSlider = ({ imageResults, selectedImages, toggleImageSelection }) => {
    const sliderRef = useRef(null);

    const scrollLeft = () => sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    const scrollRight = () => sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

    // Custom wheel handler
    const handleWheel = (event) => {
        event.preventDefault();
        sliderRef.current.scrollLeft += event.deltaY;
    };

    useEffect(() => {
        const sliderElement = sliderRef.current;
        if (sliderElement) {
            // Add non-passive wheel event listener
            sliderElement.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (sliderElement) {
                // Clean up the event listener
                sliderElement.removeEventListener('wheel', handleWheel, { passive: false });
            }
        };
    }, []);

    return (
        <div className="flex overflow-x-auto gap-4 py-2 hide-horizontal-scrollbar">
            <button onClick={scrollLeft} className="p-2"><ArrowLeftIcon className="h-6 w-6 text-gray-600" /></button>
            <div className="flex overflow-x-auto gap-4" ref={sliderRef}>
            {imageResults.map((image, index) => (
                <div key={index} className="flex-none relative flex flex-col items-center cursor-pointer">
                    <img src={image.link} alt={image.title} className="max-h-60" onClick={() => toggleImageSelection(image.link)} />
                    {selectedImages.includes(image.link) && (
                        <div className="absolute inset-0 flex justify-center items-center" onClick={() => toggleImageSelection(image.link)}>
                            <CheckCircleIcon className="h-12 w-12 text-green-500" />
                        </div>
                    )}
                    <p className="text-sm text-center">{image.title}</p>
                </div>
            ))}
            </div>
            <button onClick={scrollRight} className="p-2"><ArrowRightIcon className="h-6 w-6 text-gray-600" /></button>
        </div>
    );
};

export default ImageSlider;
