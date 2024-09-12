import { useRef, useState, useEffect } from 'react';

export default function PictureUploadComponent({ uploadPicture }) {
  const fileInputRef = useRef(null);
  const [uploadQueue, setUploadQueue] = useState([]); // Queue to store files for uploading
  const [isUploading, setIsUploading] = useState(false); // State to track upload progress

  // Helper to persist the upload queue to localStorage
  const persistUploadQueue = (queue) => {
    const filesArray = queue.map((file) => ({
      name: file.name,
      lastModified: file.lastModified,
    }));
    localStorage.setItem('uploadQueue', JSON.stringify(filesArray));
  };

  // Handle when a file is selected (from the camera)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedQueue = [...uploadQueue, file];
      setUploadQueue(updatedQueue); // Add the file to the upload queue
      persistUploadQueue(updatedQueue); // Save the updated queue to localStorage
    }
  };

  // Programmatically trigger the hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Open the camera
  };

  // Restore upload queue from localStorage on load
  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem('uploadQueue')) || [];
    setUploadQueue(savedQueue);
  }, []);

  // Process the upload queue
  useEffect(() => {
    const processUploadQueue = async () => {
      if (isUploading || uploadQueue.length === 0) return; // Prevent multiple uploads at the same time

      const file = uploadQueue[0]; // Get the first file in the queue
      setIsUploading(true); // Set upload in progress

      try {
        await uploadPicture(file); // Upload the file
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        // After uploading, remove the file from the queue
        const updatedQueue = uploadQueue.slice(1); // Remove the uploaded file
        setUploadQueue(updatedQueue); // Update the queue
        persistUploadQueue(updatedQueue); // Persist the updated queue
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
