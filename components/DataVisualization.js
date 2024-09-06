import React from 'react';
import { Box, Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'; // Import Gauge
import SpeedIcon from '@mui/icons-material/Speed'; // Import Speed icon
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'; // Make sure these imports come from recharts

// Helper functions
const calculateSoldVsUnsold = (sold, total) => {
  return total > 0 ? ((sold / total) * 100).toFixed(2) : 'N/A';
};

const formatPriceWithDollarSign = (price) => {
  return price ? `$${price.toFixed(2)}` : 'N/A';
};

const formatPercentage = (value) => `${value}%`;

export function DataVisualization({ analytics }) {
  const completedNew = analytics?.ebayAnalytics?.completed['new'] || {};
  const completedPreOwned = analytics?.ebayAnalytics?.completed['pre-owned'] || {};

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
      {/* Pre-Owned Section */}
      <Box>
        <Typography variant="h6" align="center">Pre-Owned</Typography>

        {/* Average Price */}
        <Gauge
          width={100}
          height={100}
          value={completedPreOwned.averageSoldPrice || 0}
          max={500}
          startAngle={-120}
          endAngle={120}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 15,
            },
          }}
          text={`${formatPriceWithDollarSign(completedPreOwned.averageSoldPrice || 0)}`}
        />

        {/* Selling Speed with Icon */}
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <SpeedIcon sx={{ color: '#8884d8', mb: 1 }} />
          <Typography variant="body2" align="center">{`${completedPreOwned.salesFrequencyPerWeek || 0} sales/week`}</Typography>
        </Box>

        {/* Sold vs Unsold as Percentage */}
        <Gauge
          width={100}
          height={100}
          value={calculateSoldVsUnsold(completedPreOwned.numberOfItemsSold, completedPreOwned.numberOfItems) || 0}
          max={100}
          startAngle={-120}
          endAngle={120}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 15,
            },
          }}
          text={formatPercentage(calculateSoldVsUnsold(completedPreOwned.numberOfItemsSold, completedPreOwned.numberOfItems) || 0)}
        />

        {/* Average Days to Sell */}
        <Gauge
          width={100}
          height={100}
          value={completedPreOwned.salesFreshness?.averageDaysToSell || 0}
          max={100}
          startAngle={-120}
          endAngle={120}
          text={`${completedPreOwned.salesFreshness?.averageDaysToSell || 0} days`}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 15,
            },
          }}
        />

        {/* Freshness Score */}
        <Gauge
          width={100}
          height={100}
          value={completedPreOwned.salesFreshness?.salesFreshnessScore || 0}
          max={100}
          startAngle={-120}
          endAngle={120}
          text={`${completedPreOwned.salesFreshness?.salesFreshnessScore || 0}`}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 15,
            },
          }}
        />
      </Box>

      {/* New Section */}
      <Box>
        <Typography variant="h6" align="center">New</Typography>

        {/* Average Price */}
        <Gauge
          width={100}
          height={100}
          value={completedNew.averageSoldPrice || 0}
          max={500}
          startAngle={-120}
          endAngle={120}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 15,
            },
          }}
          text={`${formatPriceWithDollarSign(completedNew.averageSoldPrice || 0)}`}
        />

        {/* Selling Speed with Icon */}
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <SpeedIcon sx={{ color: '#8884d8', mb: 1 }} />
          <Typography variant="body2" align="center">{`${completedNew.salesFrequencyPerWeek || 0} sales/week`}</Typography>
        </Box>

        {/* Sold vs Unsold as Percentage */}
        <Gauge
          width={100}
          height={100}
          value={calculateSoldVsUnsold(completedNew.numberOfItemsSold, completedNew.numberOfItems) || 0}
          max={100}
          startAngle={-120}
          endAngle={120}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 15,
            },
          }}
          text={formatPercentage(calculateSoldVsUnsold(completedNew.numberOfItemsSold, completedNew.numberOfItems) || 0)}
        />

        {/* Average Days to Sell */}
        <Gauge
          width={100}
          height={100}
          value={completedNew.salesFreshness?.averageDaysToSell || 0}
          max={100}
          startAngle={-120}
          endAngle={120}
          text={`${completedNew.salesFreshness?.averageDaysToSell || 0} days`}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 15,
            },
          }}
        />

        {/* Freshness Score */}
        <Gauge
          width={100}
          height={100}
          value={completedNew.salesFreshness?.salesFreshnessScore || 0}
          max={100}
          startAngle={-120}
          endAngle={120}
          text={`${completedNew.salesFreshness?.salesFreshnessScore || 0}`}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 15,
            },
          }}
        />
      </Box>
    </Box>
  );
}



export function GraphsVisualization({ completedData, liveData }) {
  const formatGraphData = (data) =>
    data.map((item) => ({
      date: item.date || 'N/A',
      price: item.price,
      totalPrice: item.totalPrice,
    }));

  const completedGraphData = formatGraphData(completedData);
  const liveGraphData = formatGraphData(liveData);

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h6" align="center">Price History and Live</Typography>

      {/* Completed (History) Data Visualization */}
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={completedGraphData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
            <Line type="monotone" dataKey="totalPrice" stroke="#82ca9d" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Live Data Visualization */}
      <Typography variant="h6" align="center" mt={4}>Live Data</Typography>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={liveGraphData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
            <Line type="monotone" dataKey="totalPrice" stroke="#82ca9d" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
