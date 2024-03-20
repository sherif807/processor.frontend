import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const AmazonAsinsComponent = ({ amazonProperties, onProductSelect, amazonPricing }) => {
  const [selectedAsin, setSelectedAsin] = useState(null);


  const conditionMapping = {
    new: "New",
    like_new: "Used - Like New",
    very_good: "Used - Very Good",
  };

  const formatPrice = (price) => {
    const parts = price.toFixed(2).split('.');
    return { dollars: parts[0], cents: parts[1] };
  };


  const handleSelectProduct = (asin) => {
    if (selectedAsin === asin) {
      setSelectedAsin(null);
      onProductSelect(null);
    } else {
      setSelectedAsin(asin);
      onProductSelect(asin);
    }
  };

  const goToAmazonPage = (asin) => {
    window.open(`https://www.amazon.com/dp/${asin}`, '_blank');
  };

  const isProductSelected = (asin) => asin === selectedAsin;

  const getPricingInfo = (asin) => {
    if (!Array.isArray(amazonPricing)) return [];

    const pricing = amazonPricing.filter(p => p.Identifier.ASIN === asin);
    const allOffers = pricing.flatMap(p => p.Offers).sort((a, b) => a.ListingPrice.Amount - b.ListingPrice.Amount);

    return allOffers.map((offer) => {
      let shippingTimeText = 'N/A';
      if (offer.ShippingTime) {
        const minDays = Math.ceil(offer.ShippingTime.minimumHours / 24);
        const maxDays = Math.ceil(offer.ShippingTime.maximumHours / 24);
        shippingTimeText = `${minDays}-${maxDays} days`;
        if (minDays === maxDays) {
          shippingTimeText = `${minDays} day${minDays > 1 ? 's' : ''}`;
        }
      }

      const { dollars, cents } = formatPrice(offer.ListingPrice.Amount);

      return {
        dollars,
        cents,
        shipping: offer.Shipping.Amount,
        condition: conditionMapping[offer.SubCondition] || offer.SubCondition,
        isBuyBoxWinner: offer.IsBuyBoxWinner,
        sellerId: offer.SellerId,
        sellerFeedback: offer.SellerFeedbackRating ? `${offer.SellerFeedbackRating.SellerPositiveFeedbackRating}% (${offer.SellerFeedbackRating.FeedbackCount} ratings)` : 'No feedback',
        shippingTime: shippingTimeText,
        availableDate: offer.ShippingTime && offer.ShippingTime.availableDate ? `Available from ${offer.ShippingTime.availableDate}` : '',
        isFulfilledByAmazon: offer.IsFulfilledByAmazon,
        isFeaturedMerchant: offer.IsFeaturedMerchant,
      };
    });
  };
  

  const getSummaryInfo = (asin) => {
    if (!Array.isArray(amazonPricing)) return null;
    const summary = amazonPricing.find(p => p.Identifier && p.Identifier.ASIN === asin)?.Summary;
    if (!summary) return null;
  
    // Aggregate offers by subcondition to display them in the summary
    const offerSummary = summary.NumberOfOffers?.reduce((acc, offer) => {
      const conditionKey = Object.keys(conditionMapping).find(key => offer.condition.includes(key));
      const conditionName = conditionMapping[conditionKey] || offer.condition.charAt(0).toUpperCase() + offer.condition.slice(1);
      acc[conditionName] = (acc[conditionName] || 0) + offer.OfferCount;
      return acc;
    }, {});
  
    return { ...summary, NumberOfOffers: offerSummary };
  };
  
  

  return (
    <div className="p-2 overflow-auto hide-scrollbar" style={{ maxHeight: '800px' }}>
      <h4 className="text-lg font-bold mb-2">Amazon</h4>
      <Carousel showArrows={true} showStatus={false} showIndicators={true} showThumbs={false} infiniteLoop={true} className="carousel-outer">
        {amazonProperties.items.map((item, index) => (
          <div key={index} className="block mb-4 p-2 rounded bg-white">
            {/* Make the title clickable */}
            <div className="font-bold text-sm mb-2 cursor-pointer" onClick={() => goToAmazonPage(item.asin)} style={{ overflowWrap: 'break-word' }}>
              {item.summaries[0].itemName}
            </div>
            <Carousel showArrows={true} showStatus={false} showIndicators={true} showThumbs={false} infiniteLoop={true} className="carousel-inner my-2">
              {item.images[0].images.map((image, idx) => (
                <div key={idx}>
                  <img src={image.link} alt={`Image ${idx + 1}`} />
                </div>
              ))}
            </Carousel>


            <div className="mt-2 text-sm">
            <strong>Summary:</strong><br />
            {getSummaryInfo(item.asin) && getSummaryInfo(item.asin).NumberOfOffers && Object.entries(getSummaryInfo(item.asin).NumberOfOffers).map(([condition, count], idx) => (
              <div key={idx}>{condition} Offers: {count}</div>
            ))}
          </div>

          

            <button onClick={() => handleSelectProduct(item.asin)} className={`mt-2 mb-4 text-white font-bold py-2 px-4 rounded ${isProductSelected(item.asin) ? 'bg-green-500' : 'bg-purple-500 hover:bg-purple-700'}`}>
              {isProductSelected(item.asin) ? 'Selected' : 'Select Product'}
            </button>
            {getPricingInfo(item.asin).map((priceInfo, priceIndex) => (
              <div key={priceIndex} className="text-sm">
                <strong>{priceInfo.condition}</strong> - <sup>$</sup>
                <strong>
                  {(parseFloat(priceInfo.dollars) + (priceInfo.shipping ? parseFloat(priceInfo.shipping) : 0)).toFixed(2)}
                </strong>
                {priceInfo.isFulfilledByAmazon ? ' Prime' : ''} 
                {priceInfo.isBuyBoxWinner && <span> ★</span>} <br />
                {priceInfo.sellerFeedback} Shipping Time: {priceInfo.shippingTime}<br />
                {priceInfo.availableDate && `Available Date: ${priceInfo.availableDate}`}<br />
              </div>
            ))}


          </div>
        ))}
      </Carousel>
    </div>
  );
  
  
};

export default AmazonAsinsComponent;
