
import React from 'react';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  lastUpdated: Date;
}

interface DataViewProps {
  data: WeatherData | null;
}

const DataView: React.FC<DataViewProps> = ({ data }) => {
  const copyToClipboard = () => {
    if (!data) return;
    
    const textData = formatDataAsText(data);
    navigator.clipboard.writeText(textData);
  };

  const downloadAsText = () => {
    if (!data) return;
    
    const textData = formatDataAsText(data);
    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-data-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDataAsText = (data: WeatherData) => {
    return [
      '=== WEATHER DATA REPORT ===',
      `Generated: ${new Date().toLocaleString()}`,
      `Last Updated: ${data.lastUpdated.toLocaleString()}`,
      '',
      '=== TEMPERATURE ===',
      `Current Temperature: ${data.temperature.toFixed(2)}°F`,
      `Feels Like: ${data.feelsLike.toFixed(2)}°F`,
      `Dew Point: ${data.dewPoint.toFixed(2)}°F`,
      '',
      '=== MOISTURE ===',
      `Humidity: ${data.humidity.toFixed(2)}%`,
      `Daily Rainfall: ${data.dailyRain.toFixed(2)} inches`,
      '',
      '=== SOIL CONDITIONS ===',
      `Soil Moisture: ${data.soilMoisture.toFixed(2)}%`,
      `Soil Temperature: ${data.soilTemperature.toFixed(2)}°F`,
      '',
      '=== WIND ===',
      `Wind Speed: ${data.windSpeed.toFixed(2)} mph`,
      `Wind Direction: ${data.windDirection.toFixed(2)}°`,
      '',
      '=== ATMOSPHERIC ===',
      `Barometric Pressure: ${data.pressure.toFixed(2)} inHg`,
      `UV Index: ${data.uvIndex.toFixed(2)}`,
      `Solar Radiation: ${data.solarRadiation.toFixed(2)} W/m²`,
      '',
      '=== END REPORT ===',
    ].join('\n');
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">No Data Available</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Raw Data View</h1>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all hover:scale-105"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={downloadAsText}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <pre className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {formatDataAsText(data)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DataView;
