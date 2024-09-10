import { useRef, useState, useEffect } from 'react';

export default function PictureUploadComponent({ uploadPicture }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]); // To store files waiting to be uploaded

  // Handle file selection and add it to the upload queue
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadQueue((prevQueue) => [...prevQueue, file]); // Add the new file to the queue
    }
  };

  // Programmatically trigger the hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Open the camera
  };

  // Process the upload queue one file at a time
  useEffect(() => {
    const processQueue = async () => {
      if (isUploading || uploadQueue.length === 0) return; // If already uploading or queue is empty, return

      const file = uploadQueue[0]; // Get the first file in the queue
      setIsUploading(true);

      try {
        await uploadPicture(file); // Upload the file
        setUploadQueue((prevQueue) => prevQueue.slice(1)); // Remove the file from the queue after uploading
      } catch (error) {
        console.error("Upload error:", error); // Handle upload failure if needed
      } finally {
        setIsUploading(false); // Reset the uploading state
      }
    };

    processQueue(); // Call the function to process the queue
  }, [uploadQueue, isUploading, uploadPicture]);

  return (
    <div className="p-4">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef} // Reference to trigger input programmatically
        style={{ display: 'none' }} // Hide the file input
        onChange={handleFileChange}
      />

      {/* Upload button */}
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleButtonClick}
      >
        Upload
      </button>

      {/* Optional upload status indicator */}
      {isUploading && (
        <p className="mt-2 text-gray-500">
          Uploading in the background... ({uploadQueue.length} left)
        </p>
      )}
    </div>
  );
}
