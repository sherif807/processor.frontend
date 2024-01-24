import React, { useState } from 'react';

const UpcImageSelector = ({ upcData }) => {
    console.log(upcData)
    const [selectedUpc, setSelectedUpc] = useState('');

    const handleImageClick = (upc) => {
        setSelectedUpc(upc);
        console.log('Selected UPC:', upc);
    };

    return (
        <div>
            {Object.entries(upcData).map(([upc, imageUrl]) => (
                <img 
                    key={upc} 
                    src={imageUrl} 
                    alt={`UPC: ${upc}`} 
                    onClick={() => handleImageClick(upc)} 
                    style={{ margin: '10px', cursor: 'pointer' }} 
                />
            ))}
            {selectedUpc && <p>Selected UPC: {selectedUpc}</p>}
        </div>
    );
};

export default UpcImageSelector;
