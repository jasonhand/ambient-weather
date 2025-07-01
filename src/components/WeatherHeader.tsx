
import React from 'react';
import { Settings, RefreshCw, Cloud } from 'lucide-react';

interface WeatherHeaderProps {
  onSettingsClick: () => void;
  onRefresh: () => void;
  loading: boolean;
  lastUpdated?: Date;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  onSettingsClick,
  onRefresh,
  loading,
  lastUpdated
}) => {
  const formatLastUpdated = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Weather Dashboard</h1>
            {lastUpdated && (
              <p className="text-gray-300 text-sm">
                Last updated: {formatLastUpdated(lastUpdated)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all hover:scale-105 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
        
        <button
          onClick={onSettingsClick}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all hover:scale-105"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default WeatherHeader;
