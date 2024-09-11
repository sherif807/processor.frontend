import { useRef, useState, useEffect } from 'react';

export default function PictureUploadComponent({ uploadPicture }) {
  const fileInputRef = useRef(null);
  const [uploadQueue, setUploadQueue] = useState([]); // Queue to store files for uploading
  const [isUploading, setIsUploading] = useState(false); // State to track upload progress

  // Handle when a file is selected (from the camera)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadQueue((prevQueue) => [...prevQueue, file]); // Add the file to the upload queue
    }
  };

  // Programmatically trigger the hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Open the camera
  };

  // Process the upload queue
  useEffect(() => {
    const processUploadQueue = async () => {
      if (isUploading || uploadQueue.length === 0) return; // Prevent multiple uploads at the same time

      const file = uploadQueue[0]; // Get the first file in the queue
      setIsUploading(true); // Set upload in progress

      try {
        await uploadPicture(file); // Upload the file
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        // After uploading, remove the file from the queue
        setUploadQueue((prevQueue) => prevQueue.slice(1)); // Remove the uploaded file
        setIsUploading(false); // Allow the next upload to start
      }
    };

    processUploadQueue(); // Call the function to process the queue
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

      {/* Optional queue indicator */}
      {uploadQueue.length > 0 && (
        <p className="mt-2 text-gray-500">
          Uploading in the background... ({uploadQueue.length} file(s) remaining)
        </p>
      )}
    </div>
  );
}
