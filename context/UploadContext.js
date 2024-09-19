import React, { createContext, useState, useEffect } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Supported image MIME types
  const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  // Validate if the file is an image
  const isValidImage = (file) => {
    return supportedImageTypes.includes(file.type);
  };

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
            0.8 // Image quality (for JPEG)
          );
        };
      };
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(file);
    });
  };

  // Request a pre-signed URL from the backend
  const getPreSignedUrl = async (file) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${apiUrl}/api/upload/presigned-url`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get pre-signed URL');
      }

      const jsonData = await response.json();
      return {
        preSignedUrl: jsonData.url,
        fileName: jsonData.fileName,
        fileType: jsonData.fileType, // Get fileType from the backend
      };
    } catch (error) {
      throw error;
    }
  };

  // Upload the file to S3 using the pre-signed URL
  const uploadToS3 = async (file, url, fileType) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': fileType, // Ensure correct file type from backend is passed here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload to S3');
      }
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  };

  // Save image info to the database, adding the type ('single' or 'multi')
  const saveImageToDatabase = async (fileName, type) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('type', type); // Add type (single or multi)

    try {
      const response = await fetch(`${apiUrl}/api/upload/save`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save image to the database');
      }

      const jsonData = await response.json();
    } catch (error) {
      console.error('Error saving image to database:', error);
      throw error;
    }
  };

  useEffect(() => {
    const processUploadQueue = async () => {
      if (isUploading || uploadQueue.length === 0) return;

      const { file, type } = uploadQueue[0]; // Get file and type from the queue (single or multi)
      setIsUploading(true);

      try {
        // Validate the file type before proceeding
        if (!isValidImage(file)) {
          alert('Invalid file type: Only images are allowed.');
          setUploadQueue((prevQueue) => prevQueue.slice(1)); // Remove the invalid file from the queue
          setIsUploading(false);
          return;
        }

        // Resize the image before upload
        const resizedFile = await resizeImage(file);

        // Get a pre-signed URL from the backend
        const { preSignedUrl, fileName, fileType } = await getPreSignedUrl(resizedFile);

        // Upload the resized file to S3
        await uploadToS3(resizedFile, preSignedUrl, fileType); // Use fileType from the backend

        // Save the image information to the database with the correct type
        await saveImageToDatabase(fileName, type);

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
