// AmazonAsinsComponent.js
import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const AmazonAsinsComponent = ({ amazonProperties, onProductSelect }) => {
  const [selectedAsin, setSelectedAsin] = useState(null);

  const handleSelectProduct = (asin) => {
    // Toggle selection
    if (selectedAsin === asin) {
      setSelectedAsin(null); // Unselect if the same ASIN is clicked
        onProductSelect(null); // Notify parent component of unselection
    } else {
      setSelectedAsin(asin);
        onProductSelect(asin);
    }
  };

  const isProductSelected = (asin) => asin === selectedAsin;

  return (
    <div className="p-2 overflow-auto hide-scrollbar" style={{ maxHeight: '800px' }}>
      <h3 className="text-lg font-bold mb-2">Amazon</h3>
      <Carousel
        showArrows={true}
        showStatus={false}
        showIndicators={true}
        showThumbs={false}
        infiniteLoop={true}
        className="carousel-outer"
      >
        {amazonProperties.items.map((item, index) => (
          <div key={index} className="block mb-4 p-2 rounded bg-white">
            <div className="font-bold text-sm mb-2" style={{ overflowWrap: 'break-word' }}>{item.summaries[0].itemName}</div>
            <Carousel
              showArrows={true}
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
              infiniteLoop={true}
              className="carousel-inner my-2"
            >
              {item.images[0].images.map((image, idx) => (
                <div key={idx}>
                  <img src={image.link} alt={`Image ${idx + 1}`} />
                </div>
              ))}
            </Carousel>
            <button 
              onClick={() => handleSelectProduct(item.asin)}
              className={`mt-2 text-white font-bold py-2 px-4 rounded ${isProductSelected(item.asin) ? 'bg-green-500' : 'bg-purple-500 hover:bg-purple-700'}`}
            >
              {isProductSelected(item.asin) ? 'Selected' : 'Select Product'}
            </button>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default AmazonAsinsComponent;
