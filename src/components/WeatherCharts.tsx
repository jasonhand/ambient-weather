
import React, { useState } from 'react';
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
  data: any;
}

const WeatherCharts: React.FC<WeatherChartsProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState('temperature');

  // Mock historical data - in real app this would come from API
  const generateMockData = (baseValue: number, variance: number, points: number = 24) => {
    return Array.from({ length: points }, (_, i) => {
      const time = new Date();
      time.setHours(time.getHours() - (points - 1 - i));
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: baseValue + (Math.random() - 0.5) * variance
      };
    });
  };

  const temperatureData = generateMockData(data.temperature, 10);
  const humidityData = generateMockData(data.humidity, 20);
  const pressureData = generateMockData(data.pressure, 0.1);
  const windData = generateMockData(data.windSpeed, 5);

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

  const getChartData = (dataPoints: any[], color: string, label: string, suffix: string = '') => ({
    labels: dataPoints.map(d => d.time),
    datasets: [
      {
        label,
        data: dataPoints.map(d => d.value),
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
  });

  const charts = {
    temperature: {
      title: 'Temperature',
      data: getChartData(temperatureData, '#f97316', 'Temperature', '°F'),
      gradient: 'from-orange-500 to-red-500'
    },
    humidity: {
      title: 'Humidity',
      data: getChartData(humidityData, '#06b6d4', 'Humidity', '%'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    pressure: {
      title: 'Barometric Pressure',
      data: getChartData(pressureData, '#8b5cf6', 'Pressure', ' inHg'),
      gradient: 'from-purple-500 to-indigo-500'
    },
    wind: {
      title: 'Wind Speed',
      data: getChartData(windData, '#6b7280', 'Wind Speed', ' mph'),
      gradient: 'from-gray-500 to-slate-600'
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(charts).map(([key, chart]) => (
          <button
            key={key}
            onClick={() => setActiveChart(key)}
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
        <p className="text-gray-300 text-sm">Last 24 hours • Data updates every 5 minutes</p>
      </div>
    </div>
  );
};

export default WeatherCharts;
