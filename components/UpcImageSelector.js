import React, { useState } from 'react';

const UpcImageSelector = ({ upcData, handleUpcSelected }) => {
    const [manualUpc, setManualUpc] = useState('');

    const handleImageClick = (upc) => {
        handleUpcSelected(upc);
    };

    const handleManualUpcChange = (e) => {
        setManualUpc(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (manualUpc) {
            handleImageClick(manualUpc);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={manualUpc}
                    onChange={handleManualUpcChange}
                    className="border border-gray-300 rounded p-2 mr-2"
                    placeholder="Enter UPC manually"
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submit
                </button>
            </form>

            {Object.entries(upcData).map(([upc, { img, title }]) => (
                <div key={upc} className="m-2 cursor-pointer">
                    <div className="flex flex-col items-center">
                        <img 
                            src={img} 
                            alt={`UPC: ${upc}`} 
                            onClick={() => handleImageClick(upc)}
                            className="w-24 h-24 object-contain bg-white p-1 border border-gray-200 rounded"
                        />
                        <div className="text-center mt-2">
                            <div className="font-bold">UPC: {upc}</div>
                            <div className="text-sm text-gray-600">{title}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UpcImageSelector;
