import { useRef, useState } from 'react';

export default function PictureUploadComponent({ uploadPicture }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle when a file is selected (from the camera)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Start uploading and allow the user to continue
      setIsUploading(true);  // Show upload state if needed
      uploadPicture(file)
        .then(() => {
          setIsUploading(false);  // Hide upload state after done
        })
        .catch(() => {
          setIsUploading(false);  // Hide upload state on error
        });
    }
  };

  // Programmatically trigger the hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Open the camera
  };

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

      {/* Single Upload button */}
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleButtonClick}
        disabled={isUploading} // Disable button during upload if needed
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Optional upload status indicator */}
      {isUploading && <p className="mt-2 text-gray-500">Uploading in the background...</p>}
    </div>
  );
}
