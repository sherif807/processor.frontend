import { useState, useEffect } from 'react';

export default function PictureUploadComponent({ uploadPicture, setCurrentPage }) {
    const [file, setFile] = useState(null);
    const [multipleUploads, setMultipleUploads] = useState(false);

    // Load initial state from localStorage
    useEffect(() => {
        const savedMultipleUploads = localStorage.getItem('multipleUploads');
        if (savedMultipleUploads) {
            setMultipleUploads(JSON.parse(savedMultipleUploads));
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('multipleUploads', multipleUploads);
    }, [multipleUploads]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            uploadPicture(file, multipleUploads);
        } else {
            alert("Please select a file first.");
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="multipleUploads"
                    checked={multipleUploads}
                    onChange={() => setMultipleUploads(!multipleUploads)}
                    className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="multipleUploads" className="text-sm text-gray-700">
                    Multiple Uploads
                </label>
            </div>
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
