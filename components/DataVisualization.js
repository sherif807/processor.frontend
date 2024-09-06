import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Helper functions
const calculateSoldVsUnsold = (sold, total) => {
  return total > 0 ? ((sold / total) * 100).toFixed(2) : 'N/A';
};

const formatPriceWithDollarSign = (price) => {
  return price ? `$${price.toFixed(2)}` : 'N/A';
};


function SalesDataSection({ title, data }) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <h6 className="text-lg font-semibold mb-2">{title}</h6>

      {/* Average Price */}
      <div className="flex items-center justify-center text-gray-500 ">
        <Typography>{`$${Math.round(data?.averageSoldPrice || 0)}`}</Typography>
      </div>

      {/* Sold vs Unsold */}
      <div className="flex items-center justify-center text-gray-500">
        <Typography>{`${Math.round(calculateSoldVsUnsold(data?.numberOfItemsSold, data?.numberOfItems))} %`}</Typography>
      </div>

      {/* Selling Speed */}
      <div className="flex items-center justify-center text-gray-500">
        <Typography>{`${data?.salesFrequencyPerWeek || 0} sales/week`}</Typography>
      </div>

      {/* Average Days to Sell */}
      <div className="flex items-center justify-center text-gray-500">
        <Typography>{`${Math.round(data?.salesFreshness?.averageDaysToSell || 0)} days`}</Typography>
      </div>

      {/* Freshness Score */}
      <div className="flex items-center justify-center text-gray-500">
        <Typography>{`${data?.salesFreshness?.salesFreshnessScore || 0} Freshness`}</Typography>
      </div>
    </div>
  );
}


export function DataVisualization({ analytics }) {
  const completedNew = analytics?.ebayAnalytics?.completed['new'] || {};
  const completedPreOwned = analytics?.ebayAnalytics?.completed['pre-owned'] || {};

  return (
    <div className="grid grid-cols-2 gap-6 text-center py-4">
      <SalesDataSection title="Pre-Owned" data={completedPreOwned} />
      <SalesDataSection title="New" data={completedNew} />
    </div>
  );
}

export function GraphsVisualization({ data = [], title }) {
  // Format data to ensure each entry has a date and a totalPrice
  const formatGraphData = (data) =>
    (data).map((item) => ({
      date: item.date || 'N/A',
      totalPrice: item.totalPrice || 0, // Using totalPrice only
    }));

  const graphData = formatGraphData(data);

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h6" align="center">{title}</Typography>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="totalPrice" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}


