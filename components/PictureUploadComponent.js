import { useState } from 'react';

export default function PictureUploadComponent({ uploadPicture }) {
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
            <input type="file" onChange={handleFileChange} />
            <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleUpload}
            >
                Upload Picture
            </button>
        </div>
    );
}
