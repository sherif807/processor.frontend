import { useRef, useState, useEffect } from 'react';

export default function PictureUploadComponent({ uploadPicture }) {
  const fileInputRef = useRef(null);
  const [uploadQueue, setUploadQueue] = useState([]); // Store files waiting to be uploaded
  const [uploadInProgress, setUploadInProgress] = useState(false); // Track if there's an upload in progress

  // Handle file selection and add to the upload queue
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadQueue((prevQueue) => [...prevQueue, file]); // Add the selected file to the queue
    }
  };

  // Programmatically trigger the hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Open the camera
  };

  // Process the upload queue
  useEffect(() => {
    const processUploadQueue = async () => {
      if (uploadInProgress || uploadQueue.length === 0) return;

      const file = uploadQueue[0]; // Get the first file in the queue
      setUploadInProgress(true); // Set upload in progress

      try {
        await uploadPicture(file); // Upload the file
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        // After uploading, remove the file from the queue and continue
        setUploadQueue((prevQueue) => prevQueue.slice(1)); // Remove the uploaded file
        setUploadInProgress(false); // Allow the next upload to start
      }
    };

    processUploadQueue(); // Call the function to process the queue
  }, [uploadQueue, uploadInProgress, uploadPicture]);

  return (
    <div className="p-4">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Upload button */}
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleButtonClick}
      >
        {uploadInProgress ? 'Uploading...' : 'Upload'}
      </button>

      {/* Optional queue indicator */}
      {uploadQueue.length > 0 && (
        <p className="mt-2 text-gray-500">
          Uploading in the background... ({uploadQueue.length} left)
        </p>
      )}
    </div>
  );
}
