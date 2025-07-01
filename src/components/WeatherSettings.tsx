
import React from 'react';
import { X, Key, RefreshCw } from 'lucide-react';

interface WeatherSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
  onApiKeyChange: () => void;
}

const WeatherSettings: React.FC<WeatherSettingsProps> = ({
  isOpen,
  onClose,
  refreshInterval,
  onRefreshIntervalChange,
  onApiKeyChange
}) => {
  if (!isOpen) return null;

  const intervalOptions = [
    { value: 60000, label: '1 minute' },
    { value: 300000, label: '5 minutes' },
    { value: 600000, label: '10 minutes' },
    { value: 1800000, label: '30 minutes' },
    { value: 3600000, label: '1 hour' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Data Refresh Interval
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => onRefreshIntervalChange(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {intervalOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Key className="w-4 h-4 inline mr-2" />
              API Configuration
            </label>
            <button
              onClick={onApiKeyChange}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
            >
              Update API Keys
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherSettings;
