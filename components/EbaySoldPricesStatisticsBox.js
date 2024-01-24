import React from 'react';

const EbaySoldPricesStatisticsBox = ({ pricingData }) => {
  // Destructuring to get the ebaySummary object
  const generalStats = pricingData.summary.ebaySummary.statistics;
  const conditionsStats = pricingData.summary.ebaySummary.conditions;

  return (
    <div className="bg-gray-100 p-3 mb-2 sticky top-0">
      <h4 className="text-lg font-bold mb-1">eBay</h4>

      {/* General Statistics */}
      <div className="mb-4">
        <p><strong>Number of items: </strong> {generalStats.numberOfItems}</p>
        <p><strong>Number of items sold: </strong>{generalStats.numberOfItemsSold}</p>
        <p><strong>Number of items not sold: </strong>{generalStats.numberOfItemsNotSold}</p>
        <p><strong>Percentage Sold: </strong>{generalStats.percentageSold}%</p>
      </div>


      {Object.keys(conditionsStats).map((condition, index) => {
        const conditionData = conditionsStats[condition];

        return (
          <div key={index} className="mb-4">
            <h5 className="font-bold">{condition}</h5>
            <p>Sold lowest price: ${conditionData.lowestSoldPrice || 'N/A'}</p>
            <p>Sold highest price: ${conditionData.highestSoldPrice || 'N/A'}</p>
            <p>Sold average price: ${conditionData.averageSoldPrice || 'N/A'}</p>
            <p>Unsold average price: ${conditionData.averageUnsoldPrice || '0'}</p>
            <p>Number of items: {conditionData.numberOfItems || '0'}</p>
            <p>Number of items sold: {conditionData.numberOfItemsSold || '0'}</p>
            <p>Number of items not sold: {conditionData.numberOfItemsNotSold || '0'}</p>
            <p>Percentage Sold: {conditionData.percentageSold ? `${conditionData.percentageSold}%` : 'N/A'}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EbaySoldPricesStatisticsBox;
