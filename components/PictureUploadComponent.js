import { useRef, useContext } from 'react';
import { UploadContext } from '../context/UploadContext';

export default function PictureUploadComponent() {
  const fileInputRef = useRef(null);
  const { uploadQueue, setUploadQueue, isUploading } = useContext(UploadContext); // Get the isUploading state

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadQueue((prevQueue) => [...prevQueue, file]); // Add file to global queue
    }
  };

  // Trigger file input
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Open camera
  };

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
        Upload
      </button>

      {/* Show upload queue status but don't block the UI */}
      {isUploading && (
        <p className="mt-2 text-gray-500">
          Uploading in the background... ({uploadQueue.length} file(s) remaining)
        </p>
      )}
    </div>
  );
}
