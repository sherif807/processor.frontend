import React, { createContext, useState, useEffect } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Upload single picture to the /api/upload endpoint
  const uploadSinglePicture = async (file) => {
    alert('Uploading single picture...');
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
      alert('Error uploading single picture');
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
        if (type === 'single') {
          await uploadSinglePicture(file);
        } else if (type === 'multi') {
          await uploadMultiPicture(file);
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
