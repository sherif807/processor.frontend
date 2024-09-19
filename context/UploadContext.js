import React, { createContext, useState, useEffect } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Resize the image before uploading (resize to max width/height)
  const resizeImage = (file, maxWidth = 800, maxHeight = 800) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas back to a Blob
          canvas.toBlob(
            (blob) => {
              resolve(blob); // Return the resized image blob
            },
            file.type,
            0.9 // Image quality (for JPEG)
          );
        };
      };
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(file);
    });
  };

  // Upload single picture to the /api/upload endpoint
  const uploadSinglePicture = async (file) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      console.log('Single picture upload successful', jsonData);
    } catch (error) {
      console.error('Single picture upload error:', error);
    }
  };

  // Upload multi-product picture to the /api/upload-multiple-products endpoint
  const uploadMultiPicture = async (file) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${apiUrl}/api/upload-multiple-products`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      console.log('Multi-product picture upload successful', jsonData);
    } catch (error) {
      console.error('Multi-product picture upload error:', error);
    }
  };

  useEffect(() => {
    const processUploadQueue = async () => {
      if (isUploading || uploadQueue.length === 0) return;

      const { file, type } = uploadQueue[0]; // Get file and type from the queue
      setIsUploading(true);

      try {
        // Resize the image before upload
        const resizedFile = await resizeImage(file);

        // Proceed with the correct upload type
        if (type === 'single') {
          await uploadSinglePicture(resizedFile);
        } else if (type === 'multi') {
          await uploadMultiPicture(resizedFile);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploadQueue((prevQueue) => prevQueue.slice(1)); // Remove the file from the queue
        setIsUploading(false); // Allow next upload to start
      }
    };

    processUploadQueue(); // Process uploads in the background
  }, [uploadQueue, isUploading]);

  return (
    <UploadContext.Provider value={{ uploadQueue, setUploadQueue, isUploading }}>
      {children}
    </UploadContext.Provider>
  );
};
