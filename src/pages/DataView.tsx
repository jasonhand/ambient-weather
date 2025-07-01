import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Copy, Database, Clock, Activity, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHistoricalData, HistoricalDataPoint } from '../utils/storage';

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
  location?: {
    name: string;
    coords?: {
      lat?: number;
      lon?: number;
    };
  };
  isRealData: boolean;
}

interface DataViewProps {
  data: WeatherData | null;
}

const DataView: React.FC<DataViewProps> = ({ data }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'historical' | 'raw'>('current');

  useEffect(() => {
    if (data) {
      const localData = getHistoricalData();
      setHistoricalData(localData);
    }
  }, [data]);

  const copyToClipboard = () => {
    if (!data) return;
    
    const textData = formatDataAsText(data, historicalData);
    navigator.clipboard.writeText(textData);
  };

  const downloadAsText = () => {
    if (!data) return;
    
    const textData = formatDataAsText(data, historicalData);
    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-data-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDataAsText = (data: WeatherData, historical: HistoricalDataPoint[]) => {
    const sections = [
      '=== AMBIENT WEATHER NETWORK API DATA ===',
      `Generated: ${new Date().toLocaleString()}`,
      `Data Source: ${data.isRealData ? 'Real API Data' : 'Mock Data'}`,
      `Last Updated: ${data.lastUpdated.toLocaleString()}`,
      '',
      '=== LOCATION ===',
      `Station Name: ${data.location?.name || 'Unknown'}`,
      data.location?.coords ? `Coordinates: ${data.location.coords.lat}, ${data.location.coords.lon}` : 'Coordinates: Not available',
      '',
      '=== CURRENT WEATHER DATA ===',
      `Temperature: ${data.temperature.toFixed(2)}°F`,
      `Feels Like: ${data.feelsLike.toFixed(2)}°F`,
      `Dew Point: ${data.dewPoint.toFixed(2)}°F`,
      `Humidity: ${data.humidity.toFixed(2)}%`,
      `Wind Speed: ${data.windSpeed.toFixed(2)} mph`,
      `Wind Direction: ${data.windDirection.toFixed(2)}°`,
      `Barometric Pressure: ${data.pressure.toFixed(2)} inHg`,
      `UV Index: ${data.uvIndex.toFixed(2)}`,
      `Solar Radiation: ${data.solarRadiation.toFixed(2)} W/m²`,
      `Daily Rainfall: ${data.dailyRain.toFixed(2)} inches`,
      `Soil Moisture: ${data.soilMoisture.toFixed(2)}%`,
      `Soil Temperature: ${data.soilTemperature.toFixed(2)}°F`,
      '',
      '=== HISTORICAL DATA SUMMARY ===',
      `Total Data Points: ${historical.length}`,
      `Data Collection Period: ${historical.length > 0 ? `${Math.round(historical.length * 5 / 60)} hours` : 'No data'}`,
      `Oldest Data Point: ${historical.length > 0 ? new Date(historical[0]?.timestamp).toLocaleString() : 'N/A'}`,
      `Newest Data Point: ${historical.length > 0 ? new Date(historical[historical.length - 1]?.timestamp).toLocaleString() : 'N/A'}`,
      '',
      '=== HISTORICAL DATA POINTS ===',
    ];

    // Add historical data points
    if (historical.length > 0) {
      historical.slice(-20).forEach((point, index) => {
        sections.push(
          `Point ${historical.length - 20 + index + 1}:`,
          `  Time: ${new Date(point.timestamp).toLocaleString()}`,
          `  Temperature: ${point.temperature.toFixed(2)}°F`,
          `  Humidity: ${point.humidity.toFixed(2)}%`,
          `  Pressure: ${point.pressure.toFixed(2)} inHg`,
          `  Wind Speed: ${point.windSpeed.toFixed(2)} mph`,
          `  Soil Moisture: ${point.soilMoisture.toFixed(2)}%`,
          `  UV Index: ${point.uvIndex.toFixed(2)}`,
          `  Solar Radiation: ${point.solarRadiation.toFixed(2)} W/m²`,
          ''
        );
      });
    } else {
      sections.push('No historical data available yet.');
    }

    sections.push('=== END REPORT ===');
    return sections.join('\n');
  };

  const formatHistoricalData = () => {
    if (historicalData.length === 0) {
      return 'No historical data available yet. Data will be collected as the dashboard runs.';
    }

    return historicalData
      .slice(-50) // Show last 50 data points
      .map((point, index) => {
        const time = new Date(point.timestamp).toLocaleString();
        return `[${time}] Temp: ${point.temperature.toFixed(1)}°F, Humidity: ${point.humidity.toFixed(1)}%, Pressure: ${point.pressure.toFixed(2)} inHg, Wind: ${point.windSpeed.toFixed(1)} mph, Soil: ${point.soilMoisture.toFixed(1)}%`;
      })
      .join('\n');
  };

  const formatRawData = () => {
    if (!data) return 'No data available';
    
    return JSON.stringify({
      currentData: {
        temperature: data.temperature,
        feelsLike: data.feelsLike,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        windDirection: data.windDirection,
        pressure: data.pressure,
        dewPoint: data.dewPoint,
        uvIndex: data.uvIndex,
        solarRadiation: data.solarRadiation,
        dailyRain: data.dailyRain,
        soilMoisture: data.soilMoisture,
        soilTemperature: data.soilTemperature,
        lastUpdated: data.lastUpdated.toISOString(),
        location: data.location,
        isRealData: data.isRealData
      },
      historicalDataCount: historicalData.length,
      dataCollectionInfo: {
        oldestPoint: historicalData.length > 0 ? new Date(historicalData[0]?.timestamp).toISOString() : null,
        newestPoint: historicalData.length > 0 ? new Date(historicalData[historicalData.length - 1]?.timestamp).toISOString() : null,
        totalHours: Math.round(historicalData.length * 5 / 60)
      }
    }, null, 2);
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
            <div>
              <h1 className="text-3xl font-bold text-white">Raw Data View</h1>
              <p className="text-gray-300 text-sm mt-1">
                {data.isRealData ? 'Real API Data' : 'Mock Data'} • {historicalData.length} historical points
              </p>
            </div>
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

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'current'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Current Data</span>
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'historical'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Historical Data</span>
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'raw'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Raw JSON</span>
          </button>
        </div>

        {/* Data Display */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          {activeTab === 'current' && (
            <pre className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {formatDataAsText(data, historicalData)}
            </pre>
          )}
          
          {activeTab === 'historical' && (
            <div>
              <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <h3 className="text-blue-200 font-semibold mb-2">Historical Data Summary</h3>
                <p className="text-blue-100 text-sm">
                  Total Points: {historicalData.length} • 
                  Collection Period: {historicalData.length > 0 ? `${Math.round(historicalData.length * 5 / 60)} hours` : 'No data'} • 
                  Data Source: Local Storage (collected from API calls)
                </p>
              </div>
              <pre className="text-cyan-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {formatHistoricalData()}
              </pre>
            </div>
          )}
          
          {activeTab === 'raw' && (
            <pre className="text-yellow-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {formatRawData()}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataView;
