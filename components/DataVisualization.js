import React from 'react';
import { Box, Typography } from '@mui/material';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline'; 


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


function SalesDataSectionCompleted({ preOwnedData, newData }) {
  const preOwnedSoldPercentage = Math.round(
    calculateSoldVsUnsold(preOwnedData?.numberOfItemsSold, preOwnedData?.numberOfItems)
  );
  const newSoldPercentage = Math.round(
    calculateSoldVsUnsold(newData?.numberOfItemsSold, newData?.numberOfItems)
  );

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      {/* First row: Headers */}
      <div></div> {/* Empty for label column */}
      <div className="font-semibold">Pre-Owned</div>
      <div className="font-semibold">New</div>

      {/* Labels + Data */}
      <div className="text-gray-500 font-medium">Average Price</div>
      <div>{`$${Math.round(preOwnedData?.averageSoldPrice || 0)}`}</div>
      <div>{`$${Math.round(newData?.averageSoldPrice || 0)}`}</div>

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
      <div>{`${preOwnedData?.salesFreshness?.salesFreshnessScore || 0} Freshness`}</div>
      <div>{`${newData?.salesFreshness?.salesFreshnessScore || 0} Freshness`}</div>
    </div>
  );
}


function SalesDataSectionLive({ livePreOwned,  liveNew }) {

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      {/* First row: Headers */}
      <div></div> {/* Empty for label column */}
      <div className="font-semibold">Pre-Owned</div>
      <div className="font-semibold">New</div>

      <div className="text-gray-500 font-medium">Min Price</div>
      <div>{`$${Math.round(livePreOwned?.minPrice || 0)}`}</div>
      <div>{`$${Math.round(liveNew?.minPrice || 0)}`}</div>


      {/* Labels + Data */}
      <div className="text-gray-500 font-medium">Average Price</div>
      <div>{`$${Math.round(livePreOwned?.avgPrice || 0)}`}</div>
      <div>{`$${Math.round(liveNew?.avgPrice || 0)}`}</div>



      <div className="text-gray-500 font-medium">Competition Score</div>
      <div>{`${livePreOwned?.competitionScore || 0}`}</div>
      <div>{`${liveNew?.competitionScore || 0}`}</div>

      <div className="text-gray-500 font-medium">Desirability Score</div>
      <div>{`${Math.round(livePreOwned?.desirabilityScore || 0)}`}</div>
      <div>{`${Math.round(liveNew?.desirabilityScore || 0)}`}</div>

      <div className="text-gray-500 font-medium">Freshness Score</div>
      <div>{`${livePreOwned?.salesFreshness?.salesFreshnessScore || 0} Freshness`}</div>
      <div>{`${liveNew?.salesFreshness?.salesFreshnessScore || 0} Freshness`}</div>
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
  const formatGraphData = (data) =>
    data.map((item) => ({
      date: item.date,
      totalPrice: item.totalPrice || 0, // Total price of the item
      soldStatus: item.soldStatus, // Sold status (sold/not sold)
      title: item.title || 'Unknown Title', // Item title
      price: item.price, // Item price
      shippingPrice: item.shippingPrice, // Shipping price
      condition: item.condition, // Condition of the item
      imageUrl: item.imageUrl || '', // Item image
      x: item.date, // X-axis position (date)
      y: item.totalPrice, // Y-axis position (totalPrice)
    })).reverse();

  const graphData = formatGraphData(data);

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid stroke="#ccc" />

            {/* XAxis with formatted date */}
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              tickFormatter={(tick) => formatDate(tick)}
              height={60} 
            />

            {/* YAxis with dollar sign */}
            <YAxis tickFormatter={(tick) => `$${tick}`} />

            {/* Compact Tooltip with smaller design */}
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
                      width: '200px', // Reduced width
                      maxWidth: '100%',
                      display: 'flex',
                      flexDirection: 'column', // Stacked for smaller size
                    }}>
                      {/* Image and Title Container */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {/* Thumbnail image */}
                        {item.imageUrl && (
                          <Box sx={{ flex: '0 0 40px', mr: 1 }}>
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              style={{
                                width: '40px', // Smaller image
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

                      {/* Sold status with icon */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Sold Status:</Typography>
                        {item.soldStatus === "Sold" ? (
                          <HandThumbUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <HandThumbDownIcon className="h-4 w-4 text-red-500" />
                        )}
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

            {/* Scatter Plot with conditional coloring */}
            <Scatter
              data={graphData}
              shape="circle"
              dataKey="totalPrice"
              fill="#8884d8"
            >
              {graphData.map((entry, index) => (
                <circle
                  key={`dot-${index}`}
                  cx={entry.x}
                  cy={entry.y}
                  r={5}
                  fill={entry.soldStatus === "Sold" ? "green" : "red"}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}


export function LiveGraphsVisualization({ data = [], title }) {
  // Format data and reverse it for proper chronological display
  const formatGraphData = (data) =>
    (data).map((item) => ({
      date: item.listingDate,
      totalPrice: item.totalPrice || 0, // Using totalPrice only
    })).reverse(); // Reverse the data to start from the oldest

  const graphData = formatGraphData(data);

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h6" align="center">{title}</Typography>

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
            <YAxis 
              tickFormatter={(tick) => `$${tick}`} 
            />

            {/* Tooltip */}
            <Tooltip 
              formatter={(value) => [`$${value}`, 'totalPrice']}
              offset={30} // To prevent overlap with graph
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

