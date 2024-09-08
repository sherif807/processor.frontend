import { useRef } from 'react';

export default function PictureUploadComponent({ uploadPicture }) {
  const fileInputRef = useRef(null);

  // Handle when a file is selected (from the camera)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadPicture(file);
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
      >
        Upload
      </button>
    </div>
  );
}
