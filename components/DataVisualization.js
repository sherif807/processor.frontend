import { React, useState} from 'react';
import { Box, Typography } from '@mui/material';
import { HandThumbUpIcon, HandThumbDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline'; 


import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
} from 'recharts';

import { CheckIcon } from '@heroicons/react/24/solid';




// Helper functions
const calculateSoldVsUnsold = (sold, total) => {
  return total > 0 ? ((sold / total) * 100).toFixed(2) : 'N/A';
};


function InfoPopup({ message }) {
  return (
    <div className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 shadow-md">
      {message}
    </div>
  );
}



export function SalesDataSectionCompleted({ preOwnedData, newData }) {
  const [popup, setPopup] = useState({});


  

  const preOwnedSoldPercentage = Math.round(
    calculateSoldVsUnsold(preOwnedData?.numberOfItemsSold, preOwnedData?.numberOfItems)
  );
  const newSoldPercentage = Math.round(
    calculateSoldVsUnsold(newData?.numberOfItemsSold, newData?.numberOfItems)
  );

  const showPopup = (label) => setPopup({ [label]: true });
  const hidePopup = () => setPopup({});

  return (
    <div className="grid grid-cols-3 gap-4 text-center relative">
      {/* First row: Headers */}
      <div></div> {/* Empty for label column */}
      <div className="font-semibold">Pre-Owned</div>
      <div className="font-semibold">New</div>

      {/* Labels + Data */}

      <div className="text-gray-500 font-medium">Average Price</div>
      <div>{`$${Math.round(preOwnedData?.averageSoldPrice || 0)}`}</div>
      <div>{`$${Math.round(newData?.averageSoldPrice || 0)}`}</div>

      <div className="text-gray-500 font-medium">Median Price</div>
      <div>{`$${Math.round(preOwnedData?.median || 0)}`}</div>
      <div>{`$${Math.round(newData?.median || 0)}`}</div>

      {/* Desirability Score with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Desirability Score
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('desirability')}
          onMouseLeave={hidePopup}
        />
        {popup.desirability && (
          <InfoPopup message="Desirability Score measures the demand for this product." />
        )}
      </div>
      <div>{`${Math.round(preOwnedData?.desirabilityScore || 0)}%`}</div>
      <div>{`${Math.round(newData?.desirabilityScore || 0)}%`}</div>

      {/* Sales Frequency per week with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Sales Frequency per week
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('weeklyFrequency')}
          onMouseLeave={hidePopup}
        />
        {popup.weeklyFrequency && (
          <InfoPopup message="How often this product sells on a weekly basis." />
        )}
      </div>
      <div>{`${Math.round(preOwnedData?.salesFrequencyPerWeek || 0)}`}</div>
      <div>{`${Math.round(newData?.salesFrequencyPerWeek || 0)}`}</div>

      {/* Sales Frequency per month with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Sales Frequency per month
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('monthlyFrequency')}
          onMouseLeave={hidePopup}
        />
        {popup.monthlyFrequency && (
          <InfoPopup message="How often this product sells on a monthly basis." />
        )}
      </div>
      <div>{`${Math.round(preOwnedData?.salesFrequencyPerMonth || 0)}`}</div>
      <div>{`${Math.round(newData?.salesFrequencyPerMonth || 0)}`}</div>

      <div className="text-gray-500 font-medium">Sold Count</div>
      <div>{`${Math.round(preOwnedData?.numberOfItemsSold || 0)}`}</div>
      <div>{`${Math.round(newData?.numberOfItemsSold || 0)}`}</div>

      <div className="text-gray-500 font-medium">Unsold Count</div>
      <div>{`${Math.round(preOwnedData?.numberOfItemsNotSold || 0)}`}</div>
      <div>{`${Math.round(newData?.numberOfItemsNotSold || 0)}`}</div>

      <div className="text-gray-500 font-medium">Sold %</div>
      <div className="flex justify-center items-center space-x-2">
        {preOwnedSoldPercentage === 100 && <CheckIcon className="h-5 w-5 text-green-500" />}
        <p>{`${preOwnedSoldPercentage} %`}</p>
      </div>
      <div className="flex justify-center items-center space-x-2">
        {newSoldPercentage === 100 && <CheckIcon className="h-5 w-5 text-green-500" />}
        <p>{`${newSoldPercentage} %`}</p>
      </div>

      <div className="text-gray-500 font-medium">Speed</div>
      <div>{`${preOwnedData?.salesFrequencyPerWeek || 0} sales/week`}</div>
      <div>{`${newData?.salesFrequencyPerWeek || 0} sales/week`}</div>

      <div className="text-gray-500 font-medium">Avg days to Sell</div>
      <div>{`${Math.round(preOwnedData?.salesFreshness?.averageDaysToSell || 0)} days`}</div>
      <div>{`${Math.round(newData?.salesFreshness?.averageDaysToSell || 0)} days`}</div>

      <div className="text-gray-500 font-medium">Freshness Score</div>
      <div>{`${preOwnedData?.salesFreshness || 0}`}</div>
      <div>{`${newData?.salesFreshness || 0}`}</div>


      <div className="text-gray-500 font-medium">Freshness Percentage</div>
      <div>{`${preOwnedData?.salesFreshnessPercentage || 0}%`}</div>
      <div>{`${newData?.salesFreshnessPercentage || 0}%`}</div>

      <div className="text-gray-500 font-medium">Freshness Description</div>
      <div>{`${preOwnedData?.salesFreshnessDescription}`}</div>
      <div>{`${newData?.salesFreshnessDescription}`}</div>

      <div className="text-gray-500 font-medium">Days Since Last Sale</div>
      <div>{`${preOwnedData?.salesFreshness?.daysSinceLastSale || 0} days`}</div>
      <div>{`${newData?.salesFreshness?.daysSinceLastSale || 0} days`}</div>


      <div className="text-gray-500 font-medium">Min Price</div>
      <div>{`$${Math.round(preOwnedData?.minPrice || 0)}`}</div>
      <div>{`$${Math.round(newData?.minPrice || 0)}`}</div>

      <div className="text-gray-500 font-medium">Max Price</div>
      <div>{`$${Math.round(preOwnedData?.maxPrice || 0)}`}</div>
      <div>{`$${Math.round(newData?.maxPrice || 0)}`}</div>

    </div>
  );
}



export function SalesDataSectionLive({ livePreOwned, liveNew }) {
  const [popup, setPopup] = useState({});

  const showPopup = (label) => setPopup({ [label]: true });
  const hidePopup = () => setPopup({});

  return (
    <div className="grid grid-cols-3 gap-4 text-center relative">
      {/* First row: Headers */}
      <div></div> {/* Empty for label column */}
      <div className="font-semibold">Pre-Owned</div>
      <div className="font-semibold">New</div>

      {/* Labels + Data */}
      <div className="text-gray-500 font-medium">Average Price</div>
      <div>{`$${Math.round(livePreOwned?.avgLivePrice || 0)}`}</div>
      <div>{`$${Math.round(liveNew?.avgLivePrice || 0)}`}</div>

      <div className="text-gray-500 font-medium">Median Price</div>
      <div>{`$${Math.round(livePreOwned?.medianLive || 0)}`}</div>
      <div>{`$${Math.round(liveNew?.medianLive || 0)}`}</div>

      {/* Desirability Score with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Desirability Score
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('desirability')}
          onMouseLeave={hidePopup}
        />
        {popup.desirability && (
          <InfoPopup message="Desirability Score measures the demand for this product." />
        )}
      </div>
      <div>{`${Math.round(livePreOwned?.desirabilityScore || 0)}%`}</div>
      <div>{`${Math.round(liveNew?.desirabilityScore || 0)}%`}</div>

      {/* Sales Frequency per week with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Sales Frequency per week
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('weeklyFrequency')}
          onMouseLeave={hidePopup}
        />
        {popup.weeklyFrequency && (
          <InfoPopup message="How often this product is sold on a weekly basis." />
        )}
      </div>
      <div>{`${Math.round(livePreOwned?.salesFrequencyPerWeek || 0)}`}</div>
      <div>{`${Math.round(liveNew?.salesFrequencyPerWeek || 0)}`}</div>

      {/* Sales Frequency per month with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Sales Frequency per month
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('monthlyFrequency')}
          onMouseLeave={hidePopup}
        />
        {popup.monthlyFrequency && (
          <InfoPopup message="How often this product is sold on a monthly basis." />
        )}
      </div>
      <div>{`${Math.round(livePreOwned?.salesFrequencyPerMonth || 0)}`}</div>
      <div>{`${Math.round(liveNew?.salesFrequencyPerMonth || 0)}`}</div>

      {/* Min Price with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Min Price
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('minPrice')}
          onMouseLeave={hidePopup}
        />
        {popup.minPrice && (
          <InfoPopup message="The lowest price currently listed for this item." />
        )}
      </div>
      <div>{`$${Math.round(livePreOwned?.minLivePrice || 0)}`}</div>
      <div>{`$${Math.round(liveNew?.minLivePrice || 0)}`}</div>

      {/* Max Price with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Max Price
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('maxPrice')}
          onMouseLeave={hidePopup}
        />
        {popup.maxPrice && (
          <InfoPopup message="The highest price currently listed for this item." />
        )}
      </div>
      <div>{`$${Math.round(livePreOwned?.maxLivePrice || 0)}`}</div>
      <div>{`$${Math.round(liveNew?.maxLivePrice || 0)}`}</div>

      {/* Range with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Price Range
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('priceRange')}
          onMouseLeave={hidePopup}
        />
        {popup.priceRange && (
          <InfoPopup message="The difference between the highest and lowest prices for this item." />
        )}
      </div>
      <div>{`$${Math.round(livePreOwned?.rangeLive || 0)}`}</div>
      <div>{`$${Math.round(liveNew?.rangeLive || 0)}`}</div>

      {/* Competition Score with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Competition Score
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('competitionScore')}
          onMouseLeave={hidePopup}
        />
        {popup.competitionScore && (
          <InfoPopup message="A measure of how many items are currently listed compared to sold ones." />
        )}
      </div>
      <div>{`${Math.round(livePreOwned?.competitionScore || 0)}`}</div>
      <div>{`${Math.round(liveNew?.competitionScore || 0)}`}</div>

      {/* Avg Days on Market with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Avg Days on Market (DOM)
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('avgDOM')}
          onMouseLeave={hidePopup}
        />
        {popup.avgDOM && (
          <InfoPopup message="The average number of days listings have been active." />
        )}
      </div>
      <div>{`${Math.round(livePreOwned?.avgDOM || 0)}`}</div>
      <div>{`${Math.round(liveNew?.avgDOM || 0)}`}</div>

      {/* Min Days on Market with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Min Days on Market (DOM)
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('minDOM')}
          onMouseLeave={hidePopup}
        />
        {popup.minDOM && (
          <InfoPopup message="The minimum number of days a listing has been on the market." />
        )}
      </div>
      <div>{`${Math.round(livePreOwned?.minDOM || 0)}`}</div>
      <div>{`${Math.round(liveNew?.minDOM || 0)}`}</div>

      {/* Max Days on Market with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Max Days on Market (DOM)
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('maxDOM')}
          onMouseLeave={hidePopup}
        />
        {popup.maxDOM && (
          <InfoPopup message="The maximum number of days a listing has been on the market." />
        )}
      </div>
      <div>{`${Math.round(livePreOwned?.maxDOM || 0)}`}</div>
      <div>{`${Math.round(liveNew?.maxDOM || 0)}`}</div>

      {/* Median Days on Market with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Median Days on Market (DOM)
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer"
          onMouseEnter={() => showPopup('medianDOM')}
          onMouseLeave={hidePopup}
        />
        {popup.medianDOM && (
          <InfoPopup message="The median number of days listings have been on the market." />
        )}
      </div>
      <div>{`${Math.round(livePreOwned?.medianDOM || 0)}`}</div>
      <div>{`${Math.round(liveNew?.medianDOM || 0)}`}</div>
    </div>
  );
}


export function LiveDataAnalytics({ analytics }) {
  const liveNew = analytics?.ebayAnalytics?.live['new'] || {};
  const livePreOwned = analytics?.ebayAnalytics?.live['pre-owned'] || {};

  return (
    <div className="grid gap-6 text-center py-4">
      <SalesDataSectionLive  preOwnedData={livePreOwned} liveNew={liveNew} />
    </div>
  );
}

export function CompletedDataAnalytics({ analytics }) {
  const completedNew = analytics?.ebayAnalytics?.completed['new'] || {};
  const completedPreOwned = analytics?.ebayAnalytics?.completed['pre-owned'] || {};

  return (
    <div className="grid gap-6  text-center py-4">
      <SalesDataSectionCompleted preOwnedData={completedPreOwned} newData={completedNew} />
    </div>
  );
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
};

export function CompletedGraphsVisualization({ data = [], title }) {

  if (!Array.isArray(data) || data.length === 0) {
    console.log("Data is either not an array or is empty:", data);
    return null; // Return early if data is not valid
  }

  // Format data to include necessary details for each item
  const formatGraphData = (data) =>
    data
      .map((item) => ({
        date: item.date,
        totalPrice: item.totalPrice || 0, // Total price of the item
        soldStatus: item.soldStatus, // Sold status (sold/not sold)
        title: item.title || 'Unknown Title', // Item title
        price: item.price, // Item price
        shippingPrice: item.shippingPrice, // Shipping price
        condition: item.condition, // Condition of the item
        imageUrl: item.imageUrl || '', // Item image
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort data by date in ascending order

  const graphData = formatGraphData(data);

  // Helper to format the date as 'MMM d' (e.g., 'Jul 24')
  const formatTickDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ left: 0, right: 0, top: 0, bottom: 20 }}>
            <CartesianGrid stroke="#ccc" />
            <Line
              type="monotone"
              dataKey="totalPrice"
              stroke="#8884d8"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={payload.soldStatus === 1 ? 'green' : 'red'} // Green for sold, red for unsold
                  stroke={payload.soldStatus === 1 ? 'green' : 'red'} // Matching stroke color
                />
              )}
            />

            {/* XAxis with formatted date (show month and day) */}
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              tickFormatter={(tick) => formatTickDate(tick)} // Format the tick date as 'MMM d'
              height={60} 
            />

            {/* YAxis with dollar sign */}
            <YAxis tickFormatter={(tick) => `$${tick}`} />

            {/* Tooltip with item details */}
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <Box
                      sx={{
                        border: '1px solid #ccc',
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: '#fff',
                        width: '200px', // Reduced width
                        maxWidth: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Image and Title */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {item.imageUrl && (
                          <Box sx={{ flex: '0 0 40px', mr: 1 }}>
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }}
                            />
                          </Box>
                        )}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'bold', fontSize: '0.8rem', maxWidth: '140px' }}
                        >
                          {item.title}
                        </Typography>
                      </Box>

                      {/* Item Details */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Price:</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{`$${item.price}`}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Shipping:</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{`$${item.shippingPrice}`}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Condition:</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{item.condition}</Typography>
                      </Box>

                      {/* Sold Status with icons */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Sold Status:</Typography>
                        {item.soldStatus === 1 ? (
                          <HandThumbUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <HandThumbDownIcon className="h-4 w-4 text-red-500" />
                        )}
                      </Box>

                      <Typography variant="body2" sx={{ mt: 1, color: 'gray', textAlign: 'right', fontSize: '0.7rem' }}>
                        {`Date: ${formatTickDate(item.date)}`}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}



export function LiveGraphsVisualization({ data = [], title }) {


  if (!Array.isArray(data) || data.length === 0) {
    console.log("Data is either not an array or is empty:", data);
    return null; // Return early if data is not valid
  }


  // Format and sort data by listingDate
  const formatGraphData = (data) =>
    data
      .map((item) => ({
        date: item.listingDate,
        totalPrice: item.totalPrice || 0, // Total price of the item
        title: item.title || 'Unknown Title', // Item title
        price: item.price, // Item price
        shippingPrice: item.shippingPrice, // Shipping price
        condition: item.condition, // Condition of the item
        imageUrl: item.imageUrl || '', // Item image
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by listingDate
      .reverse(); // Reverse to show oldest first

  const graphData = formatGraphData(data);

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ left: 0, right: 0, top: 0, bottom: 20 }}>
            <Line type="monotone" dataKey="totalPrice" stroke="#8884d8" />

            <CartesianGrid stroke="#ccc" />

            {/* XAxis with formatted date */}
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              tickFormatter={(tick) => formatDate(tick)}
              height={60} // Extra space for angled text
            />

            {/* YAxis with dollar sign */}
            <YAxis tickFormatter={(tick) => `$${tick}`} />

            {/* Tooltip to show item details */}
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <Box sx={{
                      border: '1px solid #ccc',
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      width: '200px',
                      maxWidth: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      {/* Image and Title */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {/* Thumbnail */}
                        {item.imageUrl && (
                          <Box sx={{ flex: '0 0 40px', mr: 1 }}>
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }}
                            />
                          </Box>
                        )}
                        {/* Title */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', maxWidth: '140px' }}>
                          {item.title}
                        </Typography>
                      </Box>

                      {/* Item details */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Price:</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{`$${item.price}`}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Shipping:</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{`$${item.shippingPrice}`}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Condition:</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{item.condition}</Typography>
                      </Box>

                      <Typography variant="body2" sx={{ mt: 1, color: 'gray', textAlign: 'right', fontSize: '0.7rem' }}>
                        {`Date: ${formatDate(item.date)}`}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
