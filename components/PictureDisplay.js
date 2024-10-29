import React, { useState, useContext } from 'react';
import { XMarkIcon, ShoppingBagIcon, ClockIcon, ArrowPathIcon, ArrowRightIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { UploadContext } from '../context/UploadContext';

export default function PictureDisplay({ picture, setPictures }) {
  const [mainImage, setMainImage] = useState(picture.filename);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0); // State to track rotation angle
  const { uploadImage } = useContext(UploadContext);

  const setMainImageHandler = (image) => {
    setMainImage(image);
    setRotation(0); // Reset rotation when a new image is selected
  };

  const rotateLeft = () => setRotation((prev) => prev - 90);
  const rotateRight = () => setRotation((prev) => prev + 90);

  const saveRotatedImage = async () => {
    try {
      const image = new Image();
      image.crossOrigin = "anonymous"; // Important to avoid tainting the canvas
      image.src = `${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${mainImage}`;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject; // Handle errors in loading
      });
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Set canvas size based on the rotated image
      if (rotation % 180 === 0) {
        canvas.width = image.width;
        canvas.height = image.height;
      } else {
        canvas.width = image.height;
        canvas.height = image.width;
      }
  
      // Rotate and draw the image on the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
  
      // Convert canvas to a Blob and upload it
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to create image blob');
          return;
        }
  
        // Create a new File object with the updated Blob
        const rotatedFile = new File([blob], mainImage, { type: 'image/jpeg' });
  
        // Re-upload the rotated image using your existing S3 upload function
        await uploadImage(rotatedFile, true);
        alert('Image saved successfully!');
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Save rotated image error:', error);
      alert('Failed to save rotated image.');
    }
  };
  

  return (
    <div className="flex flex-row gap-4">
      <div 
        className="border rounded-md shadow-md p-4 flex items-start relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: 'relative' }}
      >
        {/* Main Image */}
        <img
          src={mainImage ? `${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${mainImage}` : ''}
          alt={mainImage}
          className={`object-cover transition-transform duration-300 ease-in-out ${
            isHovered ? 'transform scale-150 z-10' : 'max-w-xs h-auto z-1'
          }`}
          style={{ zIndex: isHovered ? 10 : 1, transform: `rotate(${rotation}deg)` }} // Apply rotation
        />

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-2 z-20">
          <button
            onClick={rotateLeft}
            className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 focus:outline-none"
            title="Rotate Left"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            onClick={rotateRight}
            className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 focus:outline-none"
            title="Rotate Right"
          >
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            onClick={saveRotatedImage}
            className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 focus:outline-none"
            title="Save Rotated Image"
          >
            <CheckIcon className="h-5 w-5" aria-hidden="true" /> {/* Updated to use a save-like icon */}
          </button>

          {/* Existing Action Buttons */}
          <button
            onClick={() => purchasePicture(picture.id, setPictures)}
            className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 focus:outline-none"
            title="Mark as Purchased"
          >
            <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            onClick={() => pendingPicture(picture.id, setPictures)}
            className="bg-yellow-500 text-white rounded-full p-1 hover:bg-yellow-600 focus:outline-none"
            title="Mark as Pending"
          >
            <ClockIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            onClick={() => dismissPicture(picture.id, setPictures)}
            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
            title="Dismiss"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex flex-col space-y-2 overflow-y-auto">
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${picture.filename}`}
          alt={picture.filename}
          className="w-16 h-16 object-cover cursor-pointer border border-gray-300 rounded"
          onClick={() => setMainImageHandler(picture.filename)}
        />
        {picture.extraImages?.map((extraImage, index) => (
          <img
            key={index}
            src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}/${extraImage}`}
            alt={extraImage}
            className="w-16 h-16 object-cover cursor-pointer border border-gray-300 rounded"
            onClick={() => setMainImageHandler(extraImage)}
          />
        ))}
      </div>
    </div>
  );
}


// Functions added back to PictureViewComponent
const dismissPicture = async (id, setPictures) => {
  setPictures((prevPictures) => prevPictures.filter(p => p.id !== id));
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/pictures/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({ listingStatus: 1 }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Dismiss error:', error);
  }
};

const purchasePicture = async (id, setPictures) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/pictures/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({ purchased: true }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    dismissPicture(id, setPictures);
  } catch (error) {
    console.error('Purchase error:', error);
  }
};

const pendingPicture = async (id, setPictures) => {
  setPictures((prevPictures) => prevPictures.filter(p => p.id !== id));
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/pictures/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify({ listingStatus: 2 }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Pending error:', error);
  }
};
