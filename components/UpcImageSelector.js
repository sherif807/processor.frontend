import React from 'react';

const UpcImageSelector = ({ upcData, selectedUpc, setSelectedUpc }) => {

    const handleImageClick = (upc) => {
        setSelectedUpc(upc);
    };

    return (
        <div>
            {Object.entries(upcData).map(([upc, imageUrl]) => (
                <img 
                    key={upc} 
                    src={imageUrl} 
                    alt={`UPC: ${upc}`} 
                    onClick={() => handleImageClick(upc)}
                    style={{ margin: '10px', cursor: 'pointer', width: '100px', height: '100px' }} // Adjusted width and height
                />
            ))}
            {selectedUpc && <p>Selected UPC: {selectedUpc}</p>}
        </div>
    );
};

export default UpcImageSelector;
