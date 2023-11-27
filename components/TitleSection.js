import React from 'react';

const TitleSection = ({ inputTitle, setInputTitle, handleGenerateTitle, getProperties }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-start gap-2">
                <button
                    onClick={handleGenerateTitle}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                >
                    Generate Title
                </button>
                <button
                    onClick={getProperties}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                    Get Properties
                </button>
            </div>
            <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="Enter a title"
                className="w-1/2 p-2 border border-gray-300 rounded"
            />
        </div>
    );
};

export default TitleSection;
