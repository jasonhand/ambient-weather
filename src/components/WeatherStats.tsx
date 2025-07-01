
import React from 'react';
import { Thermometer, Droplet, Wind, Gauge, Sun, Eye, Leaf } from 'lucide-react';
import WeatherCard from './WeatherCard';

interface WeatherData {
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
}

interface WeatherStatsProps {
  data: WeatherData;
  loading: boolean;
}

const WeatherStats: React.FC<WeatherStatsProps> = ({ data, loading }) => {
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getUVLevel = (index: number) => {
    if (index <= 2) return { level: 'Low', color: 'text-green-400' };
    if (index <= 5) return { level: 'Moderate', color: 'text-yellow-400' };
    if (index <= 7) return { level: 'High', color: 'text-orange-400' };
    if (index <= 10) return { level: 'Very High', color: 'text-red-400' };
    return { level: 'Extreme', color: 'text-purple-400' };
  };

  // Generate mini chart data for each metric
  const generateMiniChart = (baseValue: number, variance: number, color: string) => {
    const points = 12;
    const data = Array.from({ length: points }, (_, i) => 
      baseValue + (Math.random() - 0.5) * variance
    );
    
    return {
      labels: Array.from({ length: points }, (_, i) => i.toString()),
      datasets: [{
        data,
        borderColor: color,
        backgroundColor: `${color}10`,
        fill: true,
        tension: 0.4,
      }]
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const uvInfo = getUVLevel(data.uvIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {/* Soil Moisture - Made more prominent by placing first */}
      <div className="md:col-span-2 lg:col-span-1">
        <WeatherCard
          title="Soil Moisture"
          value={`${data.soilMoisture.toFixed(1)}%`}
          subtitle={`Soil temp: ${data.soilTemperature.toFixed(1)}°F`}
          icon={<Leaf className="w-6 h-6" />}
          gradient="from-green-600 to-emerald-600"
          chartData={generateMiniChart(data.soilMoisture, 10, '#10b981')}
        />
      </div>

      <WeatherCard
        title="Temperature"
        value={`${Math.round(data.temperature)}°F`}
        subtitle={`Feels like ${Math.round(data.feelsLike)}°F`}
        icon={<Thermometer className="w-6 h-6" />}
        gradient="from-orange-500 to-red-500"
        chartData={generateMiniChart(data.temperature, 8, '#f97316')}
      />

      <WeatherCard
        title="Humidity"
        value={`${data.humidity.toFixed(1)}%`}
        subtitle="Relative humidity"
        icon={<Droplet className="w-6 h-6" />}
        gradient="from-blue-500 to-cyan-500"
        chartData={generateMiniChart(data.humidity, 15, '#06b6d4')}
      />

      <WeatherCard
        title="Wind"
        value={`${data.windSpeed.toFixed(1)} mph`}
        subtitle={`${getWindDirection(data.windDirection)} (${data.windDirection.toFixed(0)}°)`}
        icon={<Wind className="w-6 h-6" />}
        gradient="from-gray-500 to-slate-600"
        chartData={generateMiniChart(data.windSpeed, 5, '#6b7280')}
      />

      <WeatherCard
        title="Pressure"
        value={`${data.pressure.toFixed(2)}`}
        subtitle="inHg"
        icon={<Gauge className="w-6 h-6" />}
        gradient="from-purple-500 to-indigo-500"
        chartData={generateMiniChart(data.pressure, 0.1, '#8b5cf6')}
      />

      <WeatherCard
        title="Dew Point"
        value={`${data.dewPoint.toFixed(1)}°F`}
        subtitle="Moisture level"
        icon={<Eye className="w-6 h-6" />}
        gradient="from-teal-500 to-green-500"
        chartData={generateMiniChart(data.dewPoint, 8, '#14b8a6')}
      />

      <WeatherCard
        title="UV Index"
        value={data.uvIndex.toFixed(1)}
        subtitle={uvInfo.level}
        icon={<Sun className="w-6 h-6" />}
        gradient="from-yellow-500 to-orange-500"
        subtitleClass={uvInfo.color}
        chartData={generateMiniChart(data.uvIndex, 2, '#eab308')}
      />

      <WeatherCard
        title="Solar Radiation"
        value={`${data.solarRadiation.toFixed(0)}`}
        subtitle="W/m²"
        icon={<Sun className="w-6 h-6" />}
        gradient="from-amber-500 to-yellow-500"
        chartData={generateMiniChart(data.solarRadiation, 100, '#f59e0b')}
      />

      <WeatherCard
        title="Daily Rain"
        value={`${data.dailyRain.toFixed(2)}"`}
        subtitle="Precipitation today"
        icon={<Droplet className="w-6 h-6" />}
        gradient="from-blue-600 to-blue-800"
        chartData={generateMiniChart(data.dailyRain, 0.5, '#2563eb')}
      />
    </div>
  );
};

export default WeatherStats;
