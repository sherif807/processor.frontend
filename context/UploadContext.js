import React, { createContext, useState, useEffect } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [preparedImages, setPreparedImages] = useState([]); // Store the image keys after presigned URL

  const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const isValidImage = (file) => supportedImageTypes.includes(file.type);

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

          canvas.toBlob((blob) => resolve(blob), file.type, 0.8);
        };
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const getPreSignedUrl = async (file) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${apiUrl}/api/upload/presigned-url`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to get pre-signed URL');

      const jsonData = await response.json();
      return {
        preSignedUrl: jsonData.url,
        fileName: jsonData.fileName, // This fileName is what we will save to the backend later
        fileType: jsonData.fileType,
      };
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const processUploadQueue = async () => {
      if (isUploading || uploadQueue.length === 0) return;
  
      const { images } = uploadQueue[0]; // Only handling images here for presigned URL
      setIsUploading(true);
  
      try {
        const imageKeys = [];
  
        for (const imageData of images) {
          const { file } = imageData;
  
          if (!isValidImage(file)) {
            alert('Invalid file type: Only images are allowed.');
            setUploadQueue((prevQueue) => prevQueue.slice(1));
            setIsUploading(false);
            return;
          }
  
          // Resize image and get the presigned URL
          const resizedFile = await resizeImage(file);
          const { preSignedUrl, fileName, fileType } = await getPreSignedUrl(resizedFile);
  
          // Now, upload the file using the pre-signed URL
          const uploadResponse = await fetch(preSignedUrl, {
            method: 'PUT', // Use PUT to upload the file to S3
            headers: {
              'Content-Type': fileType, // Set the correct content type
            },
            body: resizedFile, // Send the actual resized file
          });
  
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload the image to S3');
          }
  
          // Store the S3 key or fileName after a successful upload
          imageKeys.push(fileName);
        }
  
        setPreparedImages(imageKeys); // Store the prepared image keys
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploadQueue((prevQueue) => prevQueue.slice(1));
        setIsUploading(false);
      }
    };
  
    processUploadQueue();
  }, [uploadQueue, isUploading]);
  

  return (
    <UploadContext.Provider value={{ uploadQueue, setUploadQueue, isUploading, preparedImages }}>
      {children}
    </UploadContext.Provider>
  );
};