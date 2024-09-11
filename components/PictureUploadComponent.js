import { useState } from 'react';

export default function PictureUploadComponent({ uploadPicture, setCurrentPage }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      uploadPicture(file);
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <div className="p-4">
      {/* Automatically opens the camera */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" // This directly opens the camera
        onChange={handleFileChange} 
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleUpload}
      >
        Upload Picture
      </button>
    </div>
  );
}
