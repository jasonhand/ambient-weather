
import { useState, useEffect, useCallback } from 'react';

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

export const useWeatherData = (apiKey: string, refreshInterval: number) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    if (!apiKey) return;

    setLoading(true);
    setError(null);

    try {
      // Mock data for demonstration - replace with actual API call
      const mockData: WeatherData = {
        temperature: 72 + (Math.random() - 0.5) * 10,
        feelsLike: 75 + (Math.random() - 0.5) * 8,
        humidity: 45 + Math.random() * 30,
        windSpeed: 5 + Math.random() * 15,
        windDirection: Math.random() * 360,
        pressure: 30.15 + (Math.random() - 0.5) * 0.5,
        dewPoint: 55 + (Math.random() - 0.5) * 10,
        uvIndex: Math.random() * 11,
        solarRadiation: 200 + Math.random() * 600,
        dailyRain: Math.random() * 2,
        soilMoisture: 30 + Math.random() * 40,
        soilTemperature: 65 + (Math.random() - 0.5) * 15,
        lastUpdated: new Date()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(mockData);
    } catch (err) {
      setError('Failed to fetch weather data. Please check your API keys and try again.');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      fetchWeatherData();
      const interval = setInterval(fetchWeatherData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [apiKey, refreshInterval, fetchWeatherData]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeatherData
  };
};
