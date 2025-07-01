
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
      // const response = await fetch(`https://api.ambientweather.net/v1/devices?apiKey=${apiKey}&applicationKey=${appKey}`);
      
      // For demo purposes, generating realistic mock data
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
