import React from 'react';

const TitleSection = ({ inputTitle, setInputTitle, handleGenerateTitle }) => {
    return (
        <div className="flex items-center gap-2 w-full">
            <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="Enter a title"
                className="w-4/5 p-2 border border-gray-300 rounded" // Changed to 80% width
            />
            <button
                onClick={handleGenerateTitle}
                className="w-1/10 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none" // Changed to 10% width
            >
                Generate Title
            </button>
        </div>
    );
};

export default TitleSection;
