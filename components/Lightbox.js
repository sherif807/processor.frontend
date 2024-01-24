// LightBox.js
import React from 'react';

const Lightbox = ({ children, lightboxRef }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center  items-start pt-4">
            <div className="bg-white p-4 rounded flex flex-col gap-4 max-w-4xl max-h-full overflow-auto relative" style={{ minWidth: '600px' }} ref={lightboxRef}>
                {children}
            </div>
        </div>
    );
};

export default Lightbox;
