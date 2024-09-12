import React, { createContext, useState, useEffect } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadPicture = async (file) => {
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
      console.log('Upload successful', jsonData);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  useEffect(() => {
    const processUploadQueue = async () => {
      if (isUploading || uploadQueue.length === 0) return;

      const file = uploadQueue[0];
      setIsUploading(true);

      try {
        await uploadPicture(file);
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
