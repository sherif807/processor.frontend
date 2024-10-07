import { useRef, useContext, useState, useEffect } from 'react';
import { UploadContext } from '../context/UploadContext';
import CombinedItemForm from './CombinedItemForm';

export default function PictureUploadComponent() {
  const fileInputRef = useRef(null);
  const { uploadQueue, setUploadQueue, isUploading, preparedImages } = useContext(UploadContext); // Added preparedImages from context
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadType, setUploadType] = useState('single'); // Track the type of upload (single or multi)

  const [formInputs, setFormInputs] = useState({
    quantity: 1,
    condition: 1000,
    notes: ''
  }); // Combined state for item data

  // Handle file selection for multiple images of the same item
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);

    // Add images to the upload queue to process
    setUploadQueue((prevQueue) => [...prevQueue, { images: newImages }]);
  };

  // Trigger file input for selecting multiple images of the same item
  const handleUploadClick = (type) => {
    setUploadType(type); // Set the type (single or multi) when clicking the button
    fileInputRef.current.click(); // Trigger file selection
  };

  // Handle removal of an image before uploading
  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle final submission
  const handleSubmit = async () => {
    // Ensure preparedImages are available (these will be the S3 keys)
    if (preparedImages.length === 0) {
      alert('Images are still being processed. Please wait.');
      return;
    }
  
    // Create an array for S3 image keys
    const imageData = preparedImages.map((s3Key, index) => s3Key); // Just return the S3 file name (key)
  
    // Create an object for extra data (quantity, condition, notes, etc.)
    const extraData = {
      quantity: formInputs.quantity,   // Quantity from formInputs state
      condition: formInputs.condition, // Condition from formInputs state
      notes: formInputs.notes,         // Notes from formInputs state
    };
  
    // Combine everything into a single payload
    const payload = {
      images: imageData,
      extraData: extraData,
      type: uploadType,
    };
  
    try {
      // Make a POST request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Ensure the content type is JSON
        },
        body: JSON.stringify(payload), // Send the payload as JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit the data');
      }
  
      const responseData = await response.json();
      console.log('Backend Response:', responseData);
  
      // Clear selected images, form data, and upload queue after successful submission
      setSelectedImages([]); 
      setFormInputs({ quantity: 1, condition: 1000, notes: '' });
      setUploadQueue([]);  // Clear the upload queue
      // Optionally, you may want to clear preparedImages or reset if you manage it in context
  
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  
  
  
  return (
    <div className="p-4">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Single Product Upload button */}
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => handleUploadClick('single')} // Trigger single product upload
      >
        Upload Images
      </button>

      {/* Thumbnails of selected images */}
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

      {/* Combined form for quantity, condition, and notes */}
      <CombinedItemForm
        key={formInputs.quantity + formInputs.condition + formInputs.notes}  // Add a unique key based on form inputs
        quantity={formInputs.quantity}
        condition={formInputs.condition}
        notes={formInputs.notes}
        setQuantity={(quantity) => setFormInputs((prev) => ({ ...prev, quantity }))}
        setCondition={(condition) => setFormInputs((prev) => ({ ...prev, condition }))}
        setNotes={(notes) => setFormInputs((prev) => ({ ...prev, notes }))}
      />


      {/* Submit button */}
      {selectedImages.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleSubmit}
        >
          Submit All
        </button>
      )}

      {/* Show upload status */}
      {isUploading && (
        <p className="mt-2 text-gray-500">
          Uploading in the background... ({uploadQueue.length} file(s) remaining)
        </p>
      )}
    </div>
  );
}
