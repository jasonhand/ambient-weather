
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
  location?: {
    name: string;
    coords?: {
      lat: number;
      lon: number;
    };
  };
  isRealData: boolean;
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
      // For demonstration with mock data - in real implementation, replace with actual API call
      // const response = await fetch(`https://api.ambientweather.net/v1/devices?apiKey=${apiKey}&applicationKey=${applicationKey}`);
      // const apiData = await response.json();
      
      // Mock data that simulates the API structure including "Soil 1" field
      const mockApiResponse = {
        // ... other API fields
        'Soil 1': 62.45, // This is the correct soil moisture value from API
        'soiltemp1': 68.2, // Soil temperature
        'tempf': 72.8,
        'feelsLike': 75.2,
        'humidity': 45.8,
        'windspeedmph': 8.5,
        'winddir': 225,
        'baromin': 30.15,
        'dewPoint': 55.3,
        'uv': 6.2,
        'solarradiation': 485,
        'dailyrainin': 0.15,
        'info': {
          'name': 'Demo Weather Station',
          'location': 'San Francisco, CA',
          'coords': {
            'lat': 37.7749,
            'lon': -122.4194
          }
        }
      };

      const mockData: WeatherData = {
        temperature: mockApiResponse.tempf || (72 + (Math.random() - 0.5) * 10),
        feelsLike: mockApiResponse.feelsLike || (75 + (Math.random() - 0.5) * 8),
        humidity: mockApiResponse.humidity || (45 + Math.random() * 30),
        windSpeed: mockApiResponse.windspeedmph || (5 + Math.random() * 15),
        windDirection: mockApiResponse.winddir || (Math.random() * 360),
        pressure: mockApiResponse.baromin || (30.15 + (Math.random() - 0.5) * 0.5),
        dewPoint: mockApiResponse.dewPoint || (55 + (Math.random() - 0.5) * 10),
        uvIndex: mockApiResponse.uv || (Math.random() * 11),
        solarRadiation: mockApiResponse.solarradiation || (200 + Math.random() * 600),
        dailyRain: mockApiResponse.dailyrainin || (Math.random() * 2),
        soilMoisture: mockApiResponse['Soil 1'] || (30 + Math.random() * 40), // Correctly map "Soil 1" field
        soilTemperature: mockApiResponse.soiltemp1 || (65 + (Math.random() - 0.5) * 15),
        lastUpdated: new Date(),
        location: {
          name: mockApiResponse.info?.name || 'Demo Weather Station',
          coords: mockApiResponse.info?.coords
        },
        isRealData: false // This clearly indicates we're using mock data
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Using MOCK data - not real AWN API data:', mockData);
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
