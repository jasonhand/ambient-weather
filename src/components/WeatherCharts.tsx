
import React, { useState, useEffect } from 'react';
import { getHistoricalData, HistoricalDataPoint } from '../utils/storage';
import { datadog } from '../utils/datadog';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherChartsProps {
  data: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    dewPoint: number;
    uvIndex: number;
    solarRadiation: number;
    dailyRain: number;
    soilMoisture: number;
    soilTemperature: number;
  };
}

const WeatherCharts: React.FC<WeatherChartsProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState('temperature');
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  useEffect(() => {
    // Load historical data from local storage
    const localData = getHistoricalData();
    setHistoricalData(localData);
  }, [data]); // Reload when new data comes in

  // Create historical data chart
  const createHistoricalChart = (field: keyof HistoricalDataPoint, color: string, label: string) => {
    const chartData = historicalData
      .filter(point => point[field] !== undefined && point[field] !== null)
      .map(point => ({
        time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: point[field] as number
      }))
      .slice(-24); // Show last 24 data points

    // If we have historical data, use it; otherwise fall back to current data
    if (chartData.length > 1) {
      return {
        labels: chartData.map(d => d.time),
        datasets: [
          {
            label,
            data: chartData.map(d => d.value),
            borderColor: color,
            backgroundColor: `${color}20`,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: color,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    } else {
      // Fallback to current data only
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return {
        labels: [time],
        datasets: [
          {
            label,
            data: [data[field as keyof typeof data] as number],
            borderColor: color,
            backgroundColor: `${color}20`,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: color,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 10,
          },
        ],
      };
    }
  };

  const temperatureData = createHistoricalChart('temperature', '#f97316', 'Temperature');
  const feelsLikeData = createHistoricalChart('feelsLike', '#ef4444', 'Feels Like');
  const humidityData = createHistoricalChart('humidity', '#06b6d4', 'Humidity');
  const pressureData = createHistoricalChart('pressure', '#8b5cf6', 'Pressure');
  const windSpeedData = createHistoricalChart('windSpeed', '#6b7280', 'Wind Speed');
  const windDirectionData = createHistoricalChart('windDirection', '#374151', 'Wind Direction');
  const dewPointData = createHistoricalChart('dewPoint', '#14b8a6', 'Dew Point');
  const uvIndexData = createHistoricalChart('uvIndex', '#eab308', 'UV Index');
  const solarRadiationData = createHistoricalChart('solarRadiation', '#f59e0b', 'Solar Radiation');
  const dailyRainData = createHistoricalChart('dailyRain', '#2563eb', 'Daily Rain');
  const soilMoistureData = createHistoricalChart('soilMoisture', '#10b981', 'Soil Moisture');
  const soilTemperatureData = createHistoricalChart('soilTemperature', '#059669', 'Soil Temperature');

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  const charts = {
    temperature: {
      title: 'Temperature',
      data: temperatureData,
      gradient: 'from-orange-500 to-red-500'
    },
    feelsLike: {
      title: 'Feels Like',
      data: feelsLikeData,
      gradient: 'from-red-500 to-pink-500'
    },
    humidity: {
      title: 'Humidity',
      data: humidityData,
      gradient: 'from-blue-500 to-cyan-500'
    },
    pressure: {
      title: 'Barometric Pressure',
      data: pressureData,
      gradient: 'from-purple-500 to-indigo-500'
    },
    windSpeed: {
      title: 'Wind Speed',
      data: windSpeedData,
      gradient: 'from-gray-500 to-slate-600'
    },
    windDirection: {
      title: 'Wind Direction',
      data: windDirectionData,
      gradient: 'from-slate-600 to-gray-700'
    },
    dewPoint: {
      title: 'Dew Point',
      data: dewPointData,
      gradient: 'from-teal-500 to-cyan-500'
    },
    uvIndex: {
      title: 'UV Index',
      data: uvIndexData,
      gradient: 'from-yellow-500 to-orange-500'
    },
    solarRadiation: {
      title: 'Solar Radiation',
      data: solarRadiationData,
      gradient: 'from-amber-500 to-orange-500'
    },
    dailyRain: {
      title: 'Daily Rain',
      data: dailyRainData,
      gradient: 'from-blue-600 to-indigo-600'
    },
    soilMoisture: {
      title: 'Soil Moisture',
      data: soilMoistureData,
      gradient: 'from-green-600 to-emerald-600'
    },
    soilTemperature: {
      title: 'Soil Temperature',
      data: soilTemperatureData,
      gradient: 'from-emerald-600 to-green-700'
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(charts).map(([key, chart]) => (
          <button
            key={key}
            onClick={() => {
              setActiveChart(key);
              datadog.trackChartInteraction('main_chart', key);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeChart === key
                ? `bg-gradient-to-r ${chart.gradient} text-white shadow-lg`
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {chart.title}
          </button>
        ))}
      </div>

      <div className="h-80">
        <Line data={charts[activeChart as keyof typeof charts].data} options={chartOptions} />
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-300 text-sm">
          {historicalData.length > 1 
            ? `Historical data (${historicalData.length} points) • Updates every 5 minutes`
            : 'Building historical data • Updates every 5 minutes'
          }
        </p>
      </div>
    </div>
  );
};

export default WeatherCharts;
