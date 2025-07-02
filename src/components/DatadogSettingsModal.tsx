import React, { useState, useEffect } from 'react';
import { X, Database, Eye, EyeOff } from 'lucide-react';
import { DatadogSettings, storeDatadogSettings, getStoredDatadogSettings } from '../utils/storage';
import { datadog } from '../utils/datadog';
import { getDatadogMetricsService } from '../utils/datadogMetrics';

interface DatadogSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: DatadogSettings) => void;
}

const DatadogSettingsModal: React.FC<DatadogSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsChange
}) => {
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [appKey, setAppKey] = useState('');
  const [host, setHost] = useState('weather-app');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAppKey, setShowAppKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('');

  // Update status when form state changes
  useEffect(() => {
    const datadogService = getDatadogMetricsService();
    if (enabled && datadogService?.isEnabled()) {
      setCurrentStatus('active');
    } else if (enabled && apiKey && appKey) {
      setCurrentStatus('ready_to_save');
    } else if (enabled) {
      setCurrentStatus('needs_credentials');
    } else {
      setCurrentStatus('disabled');
    }
  }, [enabled, apiKey, appKey]);

  useEffect(() => {
    if (isOpen) {
      // Load existing settings when modal opens
      const existingSettings = getStoredDatadogSettings();
      if (existingSettings) {
        setEnabled(existingSettings.enabled);
        setApiKey(existingSettings.apiKey);
        setAppKey(existingSettings.appKey);
        setHost(existingSettings.host);
      } else {
        // Reset form if no existing settings
        setEnabled(false);
        setApiKey('');
        setAppKey('');
        setHost('weather-app');
      }
      setShowApiKey(false);
      setShowAppKey(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enabled && (!apiKey.trim() || !appKey.trim())) {
      alert('Please provide both API Key and Application Key when enabling Datadog metrics.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const settings: DatadogSettings = {
        enabled,
        apiKey: apiKey.trim(),
        appKey: appKey.trim(),
        host: host.trim() || 'weather-app'
      };

      storeDatadogSettings(settings);
      onSettingsChange(settings);
      
      // Track the action
      datadog.trackUserInteraction('datadog_settings_updated', 'datadog_modal', { enabled });
      
      onClose();
    } catch (error) {
      console.error('Failed to save Datadog settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Datadog Metrics Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStatus === 'active' && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-200 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Metrics are currently being sent to Datadog</span>
              </div>
            </div>
          )}
          
          {currentStatus === 'ready_to_save' && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-blue-200 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Ready to enable Datadog metrics</span>
              </div>
            </div>
          )}

          {currentStatus === 'needs_credentials' && (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-orange-200 text-sm">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Please enter your Datadog API keys</span>
              </div>
            </div>
          )}

          {currentStatus === 'disabled' && (
            <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-gray-200 text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Datadog metrics are disabled</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Enable Datadog Metrics
            </label>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Datadog API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Datadog API key"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={enabled}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Datadog Application Key
                </label>
                <div className="relative">
                  <input
                    type={showAppKey ? 'text' : 'password'}
                    value={appKey}
                    onChange={(e) => setAppKey(e.target.value)}
                    placeholder="Enter your Datadog Application key"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={enabled}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAppKey(!showAppKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showAppKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Host Name (optional)
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="weather-app"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-200 mb-2">What data will be sent?</h4>
                <ul className="text-xs text-blue-100 space-y-1">
                  <li>• All weather metrics (temperature, humidity, wind, etc.)</li>
                  <li>• Location information as tags</li>
                  <li>• Timestamps for each data point</li>
                  <li>• Data is sent only while the app is running</li>
                </ul>
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DatadogSettingsModal; 