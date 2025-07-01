
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';
import { datadog } from '../utils/datadog';
import WeatherHeader from '../components/WeatherHeader';
import WeatherStats from '../components/WeatherStats';
import WeatherCharts from '../components/WeatherCharts';
import WeatherSettings from '../components/WeatherSettings';
import ApiKeyModal from '../components/ApiKeyModal';
import { useWeatherData } from '../hooks/useWeatherData';
import { getStoredApiKey } from '../utils/storage';

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
  
  const { data: weatherData, loading, error, refetch } = useWeatherData(apiKey, refreshInterval);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowApiModal(true);
    }
    
    // Track page view
    datadog.addAction('page_view', { page: 'index' });
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setShowApiModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <WeatherHeader 
            onSettingsClick={() => setShowSettings(true)}
            onRefresh={refetch}
            loading={loading}
            lastUpdated={weatherData?.lastUpdated}
            location={weatherData?.location}
            isRealData={weatherData?.isRealData}
          />
          
          {weatherData && (
            <Link
              to="/data"
              state={{ data: weatherData }}
              className="flex items-center space-x-2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all hover:scale-105"
            >
              <Database className="w-5 h-5" />
              <span className="hidden sm:inline">Raw Data</span>
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl text-red-100">
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-red-200">{error}</p>
            <button 
              onClick={() => setShowApiModal(true)}
              className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Update API Key
            </button>
          </div>
        )}

        {weatherData && (
          <>
            <WeatherStats data={weatherData} loading={loading} />
            <WeatherCharts data={weatherData} />
          </>
        )}

        {!weatherData && !loading && !error && (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to Weather Dashboard</h2>
              <p className="text-gray-300 mb-6">Connect your Ambient Weather API to get started</p>
              <button 
                onClick={() => setShowApiModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                Set Up API Key
              </button>
            </div>
          </div>
        )}
      </div>

      <ApiKeyModal 
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSubmit={handleApiKeySubmit}
      />

      <WeatherSettings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        refreshInterval={refreshInterval}
        onRefreshIntervalChange={setRefreshInterval}
        onApiKeyChange={() => setShowApiModal(true)}
      />
    </div>
  );
};

export default Index;
