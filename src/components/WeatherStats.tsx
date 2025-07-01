
import React from 'react';
import { Thermometer, Droplet, Wind, Gauge, Sun, Eye } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const uvInfo = getUVLevel(data.uvIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      <WeatherCard
        title="Temperature"
        value={`${Math.round(data.temperature)}°F`}
        subtitle={`Feels like ${Math.round(data.feelsLike)}°F`}
        icon={<Thermometer className="w-6 h-6" />}
        gradient="from-orange-500 to-red-500"
      />

      <WeatherCard
        title="Humidity"
        value={`${data.humidity}%`}
        subtitle="Relative humidity"
        icon={<Droplet className="w-6 h-6" />}
        gradient="from-blue-500 to-cyan-500"
      />

      <WeatherCard
        title="Wind"
        value={`${data.windSpeed} mph`}
        subtitle={`${getWindDirection(data.windDirection)} (${data.windDirection}°)`}
        icon={<Wind className="w-6 h-6" />}
        gradient="from-gray-500 to-slate-600"
      />

      <WeatherCard
        title="Pressure"
        value={`${data.pressure.toFixed(2)}`}
        subtitle="inHg"
        icon={<Gauge className="w-6 h-6" />}
        gradient="from-purple-500 to-indigo-500"
      />

      <WeatherCard
        title="Dew Point"
        value={`${Math.round(data.dewPoint)}°F`}
        subtitle="Moisture level"
        icon={<Eye className="w-6 h-6" />}
        gradient="from-teal-500 to-green-500"
      />

      <WeatherCard
        title="UV Index"
        value={data.uvIndex.toString()}
        subtitle={uvInfo.level}
        icon={<Sun className="w-6 h-6" />}
        gradient="from-yellow-500 to-orange-500"
        subtitleClass={uvInfo.color}
      />

      <WeatherCard
        title="Solar Radiation"
        value={`${data.solarRadiation}`}
        subtitle="W/m²"
        icon={<Sun className="w-6 h-6" />}
        gradient="from-amber-500 to-yellow-500"
      />

      <WeatherCard
        title="Daily Rain"
        value={`${data.dailyRain.toFixed(2)}"`}
        subtitle="Precipitation today"
        icon={<Droplet className="w-6 h-6" />}
        gradient="from-blue-600 to-blue-800"
      />
    </div>
  );
};

export default WeatherStats;
