import { React, useState} from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { HandThumbUpIcon, HandThumbDownIcon, InformationCircleIcon, XMarkIcon, EyeIcon, EyeSlashIcon, LinkIcon } from '@heroicons/react/24/outline'; 


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


const renderPriceProgressBar = (min, max) => {
  const isValid = (value) => value !== undefined && value !== null && value > 0; // Ensure there's valid data

  return isValid(min) && isValid(max) ? (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="caption">{`$${min} - $${max}`}</Typography>
      <LinearProgress
        variant="determinate"
        value={((max - min) / max) * 100} // Calculate percentage
        sx={{ width: '100px', height: 10 }}
      />
    </Box>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <XMarkIcon className="h-4 w-4 text-red-500" />
    </Box>
  );
};


function displayValue(value, prefix = '', suffix = '', isGoodValue = false) {
  const hairSpace = '\u200A'; // Unicode for hair space (thinner than thin space)
  const thinSpace = '\u2009'; // Unicode for thin space

  return value ? (
    <span className="inline-flex items-center">
      {isGoodValue && <CheckIcon className="h-5 w-5 text-green-500" />} {/* Check mark with tiny margin */}
      {prefix}{hairSpace}{Math.round(value)}{thinSpace}{suffix}
    </span>
  ) : (
    <XMarkIcon className="h-4 w-4 text-red-500 mx-auto" />
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
      <div>{displayValue(preOwnedData?.averageSoldPrice, '$')}</div>
      <div>{displayValue(newData?.averageSoldPrice, '$')}</div>

      {/* <div className="text-gray-500 font-medium">Median Price</div>
      <div>{displayValue(preOwnedData?.median, '$')}</div>
      <div>{displayValue(newData?.median, '$')}</div> */}

      <div className="text-gray-500 font-medium">Percentage Sold</div>
      <div className="flex justify-center items-center space-x-2">
        <div>{displayValue(preOwnedData?.percentageSold, '', '%', preOwnedData?.percentageSold > 95)}</div>
      </div>

      <div className="flex justify-center items-center space-x-2">
        <div>{displayValue(newData?.percentageSold, '', '%', newData?.percentageSold > 95)}</div>
      </div>

      <div className="text-gray-500 font-medium">Price Range Sold</div>
      <div>{renderPriceProgressBar(preOwnedData?.minPrice, preOwnedData?.maxPrice)}</div>
      <div>{renderPriceProgressBar(newData?.minPrice, newData?.maxPrice)}</div>

      <div className="text-gray-500 font-medium">Sales Count</div>

      <div>
        {preOwnedData && preOwnedData.numberOfItemsSold !== undefined && preOwnedData.numberOfItemsNotSold !== undefined ? (
          preOwnedData.numberOfItemsSold === 1 ? (
            <div>{displayValue(preOwnedData.numberOfItemsSold, '', ' sold')}</div>  // Display "1 sold"
          ) : preOwnedData.numberOfItemsNotSold === 0 ? (
            <div>{displayValue(preOwnedData.numberOfItemsSold, 'All ', ' sold')}</div>  // Display "All X sold" when everything is sold
          ) : (
            <div>{displayValue(preOwnedData.numberOfItemsSold, '', ` sold out of ${preOwnedData.numberOfItemsSold + preOwnedData.numberOfItemsNotSold}`)}</div>  // Display "X sold out of Y" if there are unsold items
          )
        ) : (
          <div>{displayValue()}</div>  // Display if data is unavailable
        )}
      </div>

      <div>
        {newData && newData.numberOfItemsSold !== undefined && newData.numberOfItemsNotSold !== undefined ? (
          newData.numberOfItemsSold === 1 ? (
            <div>{displayValue(newData.numberOfItemsSold, '', ' sold')}</div>  // Display "1 sold"
          ) : newData.numberOfItemsNotSold === 0 ? (
            <div>{displayValue(newData.numberOfItemsSold, 'All ', ' sold')}</div>  // Display "All X sold" when everything is sold
          ) : (
            <div>{displayValue(newData.numberOfItemsSold, '', ` sold out of ${newData.numberOfItemsSold + newData.numberOfItemsNotSold}`)}</div>  // Display "X sold out of Y" if there are unsold items
          )
        ) : (
          <div>{displayValue()}</div>  // Display if data is unavailable
        )}
      </div>




      {/* Desirability Score with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Desirability
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer ml-2"
          onMouseEnter={() => showPopup('desirability')}
          onMouseLeave={hidePopup}
        />
        {popup.desirability && (
          <InfoPopup message="Desirability Score measures the demand for this product." />
        )}
      </div>
      <div>{displayValue(preOwnedData?.desirabilityScore, '', '%', newData?.percentageSold > 95)}</div>
      <div>{displayValue(newData?.desirabilityScore, '', '%', newData?.percentageSold > 95)}</div>

      {/* Sales Frequency per week with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Sales Per Week
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer  ml-2"
          onMouseEnter={() => showPopup('weeklyFrequency')}
          onMouseLeave={hidePopup}
        />
        {popup.weeklyFrequency && (
          <InfoPopup message="How often this product sells on a weekly basis." />
        )}
      </div>
      <div>{displayValue(preOwnedData?.salesFrequencyPerWeek)}</div>
      <div>{displayValue(newData?.salesFrequencyPerWeek)}</div>

      {/* Sales Frequency per month with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Sales Per Month
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer  ml-2"
          onMouseEnter={() => showPopup('monthlyFrequency')}
          onMouseLeave={hidePopup}
        />
        {popup.monthlyFrequency && (
          <InfoPopup message="How often this product sells on a monthly basis." />
        )}
      </div>
      <div>{displayValue(preOwnedData?.salesFrequencyPerMonth)}</div>
      <div>{displayValue(newData?.salesFrequencyPerMonth)}</div>


      <div className="text-gray-500 font-medium">Last Sale</div>
      <div>{displayValue(preOwnedData?.daysSinceLastSale, '', 'days')}</div>
      <div>{displayValue(newData?.daysSinceLastSale, '', 'days')}</div>

{/* 
      <div className="text-gray-500 font-medium">Freshness Score</div>
      <div>{displayValue(preOwnedData?.salesFreshnessPercentage)}</div>
      <div>{displayValue(newData?.salesFreshnessPercentage)}</div> */}

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
      <div className="text-gray-500 font-medium">Average Live Price</div>
      <div>{displayValue(livePreOwned?.avgLivePrice, '$')}</div>
      <div>{displayValue(liveNew?.avgLivePrice, '$')}</div>


      {/* <div className="text-gray-500 font-medium">Median Price</div>
      <div>{displayValue(livePreOwned?.medianLive, '$')}</div>
      <div>{displayValue(liveNew?.medianLive, '$')}</div> */}



      {/* Min Price and Max Price with Progress Bar */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Price Range
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer ml-1"
          onMouseEnter={() => showPopup('priceRange')}
          onMouseLeave={hidePopup}
        />
        {popup.priceRange && (
          <InfoPopup message="The lowest and highest prices currently listed for this item." />
        )}
      </div>
      <div>{renderPriceProgressBar(livePreOwned?.minLivePrice, livePreOwned?.maxLivePrice)}</div>
      <div>{renderPriceProgressBar(liveNew?.minLivePrice, liveNew?.maxLivePrice)}</div>



      {/* Competition Score with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Competition
      </div>
      <div>{displayValue(livePreOwned?.competition)}</div>
      <div>{displayValue(liveNew?.competition)}</div>

      {/* Avg Days on Market with InfoPopup */}
      <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
        Avg Days on Market
        <InformationCircleIcon
          className="h-4 w-4 text-gray-400 cursor-pointer ml-1"
          onMouseEnter={() => showPopup('avgDOM')}
          onMouseLeave={hidePopup}
        />
        {popup.avgDOM && (
          <InfoPopup message="The average number of days listings have been active." />
        )}
      </div>
      <div>{displayValue(livePreOwned?.avgDOM, '', 'days')}</div>
      <div>{displayValue(liveNew?.avgDOM, '', 'days')}</div>


      {/* <div className="text-gray-500 font-medium flex items-center justify-center space-x-1 relative">
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
      <div>{displayValue(livePreOwned?.minDOM, '', 'days')}</div>
      <div>{displayValue(liveNew?.minDOM, '', 'days')}</div>


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
      <div>{displayValue(livePreOwned?.maxDOM, '', 'days')}</div>
      <div>{displayValue(liveNew?.maxDOM, '', 'days')}</div> */}


    </div>
  );
}


export function LiveDataAnalytics({ analytics}) {
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




export function CompletedGraphsVisualization({ data = [], title , completedUrl}) {
  if (!Array.isArray(data) || data.length === 0) {
    console.log("Data is either not an array or is empty:", data);
    return null; // Return early if data is not valid
  }

  // Thumbnail visibility percentages (0%, 30%, 60%, 100%)
  const [thumbnailVisibility, setThumbnailVisibility] = useState(30); // Start at 30%

  // Toggle the thumbnail visibility percentage
  const toggleThumbnailVisibility = () => {
    setThumbnailVisibility((prev) => {
      if (prev === 100) return 0; // Reset to 0% after 100%
      if (prev === 0) return 30;   // First toggle sets to 30%
      if (prev === 30) return 60;  // Next toggle sets to 60%
      if (prev === 60) return 100; // Next toggle sets to 100%
      return 0;                    // Cycle back to 0% after 100%
    });
  };

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
  try {
    const date = new Date(dateStr);

    // Check if the date is valid before formatting
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date'); // Throw an error if the date is invalid
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    // Return a fallback value if an error occurs (invalid date or formatting issue)
    return 'Invalid Date';
  }
};


  // Limit thumbnails shown based on visibility percentage
  const thumbnailLimit = Math.ceil((graphData.length * thumbnailVisibility) / 100);

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>


      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
        {/* Heroicon button to toggle thumbnail visibility */}
        <button onClick={toggleThumbnailVisibility} className="flex items-center space-x-2">
          {thumbnailVisibility === 0 ? (
            <EyeSlashIcon className="h-6 w-6 text-gray-500" />
          ) : (
            <EyeIcon className="h-6 w-6 text-gray-500" />
          )}
          <span className="text-gray-500">
            {thumbnailVisibility === 0 ? 'Show Images' : `Thumbnails: ${thumbnailVisibility}%`}
          </span>
        </button>

        {/* LinkIcon aligned to the right */}
        {completedUrl && (
          <a href={completedUrl} target="_blank" rel="noopener noreferrer">
            <LinkIcon className="h-6 w-6 text-blue-500 hover:text-blue-700 cursor-pointer" />
          </a>
        )}
      </Box>


      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ left: 0, right: 0, top: 0, bottom: 20 }}>
            <CartesianGrid stroke="#ccc" />
            <Line
              type="monotone"
              dataKey="totalPrice"
              stroke="#8884d8"
              strokeWidth={2}
              // Custom dot to display thumbnails with a limit
              dot={({ cx, cy, index, payload }) => {
                if (index % Math.ceil(graphData.length / thumbnailLimit) === 0 && thumbnailVisibility !== 0) {
                  return (
                    <>
                      {/* Circle representing the dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill={payload.soldStatus === 1 ? 'green' : 'red'} // Green for sold, red for unsold
                        stroke={payload.soldStatus === 1 ? 'green' : 'red'} // Matching stroke color
                      />

                      {/* Thumbnail near the dot */}
                      {payload.imageUrl && (
                        <foreignObject x={cx - 20} y={cy - 60} width="40" height="40">
                          <img
                            src={payload.imageUrl}
                            alt={payload.title}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                              border: '2px solid #ccc',
                            }}
                          />
                        </foreignObject>
                      )}
                    </>
                  );
                }

                // For other points, just render the dot without a thumbnail
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={payload.soldStatus === 1 ? 'green' : 'red'} // Green for sold, red for unsold
                    stroke={payload.soldStatus === 1 ? 'green' : 'red'} // Matching stroke color
                  />
                );
              }}
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






export function LiveGraphsVisualization({ data = [], title, liveUrl}) {
  if (!Array.isArray(data) || data.length === 0) {
    console.log("Data is either not an array or is empty:", data);
    return null; // Return early if data is not valid
  }

  // Thumbnail visibility percentages (0%, 30%, 60%, 100%)
  const [thumbnailVisibility, setThumbnailVisibility] = useState(30); // Start at 30%

  // Toggle the thumbnail visibility percentage
  const toggleThumbnailVisibility = () => {
    setThumbnailVisibility((prev) => {
      if (prev === 100) return 0; // Reset to 0% after 100%
      if (prev === 0) return 30;   // First toggle sets to 30%
      if (prev === 30) return 60;  // Next toggle sets to 60%
      if (prev === 60) return 100; // Next toggle sets to 100%
      return 0;                    // Cycle back to 0% after 100%
    });
  };

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

// Helper to format the date as 'MMM d' (e.g., 'Jul 24')
const formatTickDate = (dateStr) => {
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date'; // Return fallback for invalid dates
  }

  // Format the date if it's valid
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};


  // Limit thumbnails shown based on visibility percentage
  const thumbnailLimit = Math.ceil((graphData.length * thumbnailVisibility) / 100);

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>

{/* Heroicon button to toggle thumbnail visibility and LinkIcon */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
  <button onClick={toggleThumbnailVisibility} className="flex items-center space-x-2">
    {thumbnailVisibility === 0 ? (
      <EyeSlashIcon className="h-6 w-6 text-gray-500" />
    ) : (
      <EyeIcon className="h-6 w-6 text-gray-500" />
    )}
    <span className="text-gray-500">
      {thumbnailVisibility === 0 ? 'Show Images' : `Thumbnails: ${thumbnailVisibility}%`}
    </span>
  </button>

  {/* LinkIcon aligned to the right */}
  {liveUrl && (
    <a href={liveUrl} target="_blank" rel="noopener noreferrer">
      <LinkIcon className="h-6 w-6 text-blue-500 hover:text-blue-700 cursor-pointer" />
    </a>
  )}
</Box>


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
              tickFormatter={(tick) => formatTickDate(tick)}
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
                        {`Date: ${formatTickDate(item.date)}`}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />

            {/* Custom dot to display thumbnails with a limit */}
            <Line
              type="monotone"
              dataKey="totalPrice"
              stroke="#8884d8"
              strokeWidth={2}
              dot={({ cx, cy, index, payload }) => {
                if (index % Math.ceil(graphData.length / thumbnailLimit) === 0 && thumbnailVisibility !== 0) {
                  return (
                    <>
                      {/* Circle representing the dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill="blue"
                        stroke="blue"
                      />

                      {/* Thumbnail near the dot */}
                      {payload.imageUrl && (
                        <foreignObject x={cx - 20} y={cy - 60} width="40" height="40">
                          <img
                            src={payload.imageUrl}
                            alt={payload.title}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                              border: '2px solid #ccc',
                            }}
                          />
                        </foreignObject>
                      )}
                    </>
                  );
                }

                // For other points, just render the dot without a thumbnail
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="blue"
                    stroke="blue"
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

