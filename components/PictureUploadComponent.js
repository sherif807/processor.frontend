import { useRef, useContext, useState } from 'react';
import { UploadContext } from '../context/UploadContext';

export default function PictureUploadComponent() {
  const fileInputRef = useRef(null);
  const { preparedImages, uploadImage, clearPreparedImages } = useContext(UploadContext);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadType, setUploadType] = useState('single');

  const [formInputs, setFormInputs] = useState({
    quantity: 1,
    condition: 1000,
    notes: ''
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prevImages) => [...prevImages, ...newImages]);

    // Upload each image immediately
    newImages.forEach((image) => {
      uploadImage(image.file);
    });
  };

  const handleUploadClick = (type) => {
    setUploadType(type);
    fileInputRef.current.click();
  };

  const handleCameraClick = () => {
    fileInputRef.current.setAttribute('capture', 'environment'); // Directly opens the camera
    fileInputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (preparedImages.length === 0) {
      alert('Images are still being processed. Please wait.');
      return;
    }

    const imageData = preparedImages.map((s3Key) => s3Key);

    const extraData = {
      quantity: formInputs.quantity,
      condition: formInputs.condition,
      notes: formInputs.notes,
    };

    const payload = {
      images: imageData,
      extraData: extraData,
      type: uploadType,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the data');
      }

      const responseData = await response.json();
      console.log('Backend Response:', responseData);

      setSelectedImages([]);
      setFormInputs({ quantity: 1, condition: 1000, notes: '' });
      clearPreparedImages(); // Clear the uploaded images
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"  // Opens camera by default on mobile
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => handleUploadClick('single')}
      >
        Upload Images
      </button>

      <button
        className="mt-2 ml-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleCameraClick}
      >
        📷 Open Camera
      </button>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {selectedImages.map((imageData, index) => (
          <div key={index} className="relative">
            <img src={imageData.preview} alt="Preview" className="w-full h-auto" />
            <button
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
              onClick={() => handleRemoveImage(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Custom form for quantity, condition, and notes */}
      <div className="p-4 border rounded mt-4">
        <div className="mb-4">
          <label className="block text-xs text-gray-500">Quantity:</label>
          <select
            className="border rounded p-1 text-sm"
            value={formInputs.quantity}
            onChange={(e) => setFormInputs((prev) => ({ ...prev, quantity: e.target.value }))}
            style={{ width: '100px' }}
          >
            {[...Array(10).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-500">Item Condition:</label>
          <select
            className="border rounded p-1 text-sm"
            value={formInputs.condition}
            onChange={(e) => setFormInputs((prev) => ({ ...prev, condition: e.target.value }))}
            style={{ width: '100px' }}
          >
            <option value={1000}>New</option>
            <option value={1500}>Open Box</option>
            <option value={3000}>Used</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-500">Notes:</label>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Add notes"
            value={formInputs.notes}
            onChange={(e) => setFormInputs((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>
      </div>

      {selectedImages.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleSubmit}
        >
          Submit All
        </button>
      )}
    </div>
  );
}
