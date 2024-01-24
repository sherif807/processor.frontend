import React from 'react';

const GoogleShoppingPricesStatisticsBox = ({ handleOpenLightBoxForGoogle, pricingData }) => {
  const generalStats = pricingData.summary?.googleSummary.statistics;
  const conditionsStats = pricingData.summary?.googleSummary.conditions;


  return (
    <div className="bg-gray-100 p-3 mb-2 sticky top-0">
      <h4 className="text-lg font-bold mb-1">Google</h4>

      {/* General Statistics */}
      <div className="mb-4">
        <p><strong>Total Competitions: </strong> {generalStats?.totalNumberOfCompetitions}</p>
      </div>

      {/* Condition-Specific Statistics */}
      {Object.keys(conditionsStats).map((condition, index) => {
        const conditionData = conditionsStats[condition];

        return (
          <div key={index} className="mb-4">
            <h5 className="font-bold">{condition.charAt(0).toUpperCase() + condition.slice(1)}</h5>
            <p><strong>Highest Price: </strong> <strong> ${conditionData.highestPrice} </strong></p>
            <p><strong>Lowest Price: </strong>${conditionData.lowestPrice}</p>
            <p><strong>Average Price: </strong> ${conditionData.averagePrice}</p>
          </div>
        );
      })}

      <button onClick={() => handleOpenLightBoxForGoogle( pricingData)}>
        Listings
      </button>
    </div>
  );
};

export default GoogleShoppingPricesStatisticsBox;
