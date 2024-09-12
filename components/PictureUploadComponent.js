import { useRef, useContext } from 'react';
import { UploadContext } from '../context/UploadContext';

export default function PictureUploadComponent() {
  const fileInputRef = useRef(null);
  const { uploadQueue, setUploadQueue, isUploading } = useContext(UploadContext); // Get the isUploading state

  // Handle file change for single file upload
  const handleSingleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadQueue((prevQueue) => [...prevQueue, { file, type: 'single' }]); // Add file with 'single' type
    }
  };

  // Handle file change for multi-product upload
  const handleMultiFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadQueue((prevQueue) => [...prevQueue, { file, type: 'multi' }]); // Add file with 'multi' type
    }
  };

  // Trigger single file input
  const handleSingleUploadClick = () => {
    fileInputRef.current.click(); // Open camera for single product upload
    fileInputRef.current.onchange = handleSingleFileChange;
  };

  // Trigger multi-product file input
  const handleMultiUploadClick = () => {
    fileInputRef.current.click(); // Open camera for multi-product upload
    fileInputRef.current.onchange = handleMultiFileChange;
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
      />

      {/* Single Upload button */}
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSingleUploadClick}
      >
        Upload
      </button>

      {/* Multi-Product Upload button */}
      <button
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded ml-2"
        onClick={handleMultiUploadClick}
      >
        Upload Multi-Product Picture
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
