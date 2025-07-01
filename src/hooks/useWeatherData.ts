import { useState, useEffect, useCallback } from 'react';
import { storeHistoricalData, HistoricalDataPoint, cleanupHistoricalData } from '../utils/storage';
import { datadog } from '../utils/datadog';

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

// Ambient Weather Network API response interface
interface AmbientWeatherDevice {
  info?: {
    name?: string;
    location?: string;
    coords?: {
      lat?: number;
      lon?: number;
    };
  };
  lastData?: {
    dateutc?: number;
    tempf?: number;
    feelsLike?: number;
    humidity?: number;
    windspeedmph?: number;
    winddir?: number;
    baromin?: number;
    dewPoint?: number;
    uv?: number;
    solarradiation?: number;
    dailyrainin?: number;
    // Soil moisture fields - API might use different names
    soilhum1?: number;
    'Soil 1'?: number;
    soil1?: number;
    soilmoisture1?: number;
    soil_moisture_1?: number;
    // Soil temperature fields
    soiltemp1?: number;
    soil_temp_1?: number;
    [key: string]: number | undefined; // Allow for any additional numeric fields
  };
}

export const useWeatherData = (combinedApiKey: string, refreshInterval: number) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    if (!combinedApiKey) return;

    // Parse the combined API key (format: "apiKey:applicationKey")
    const [apiKey, applicationKey] = combinedApiKey.split(':');
    
    if (!apiKey || !applicationKey) {
      setError('Invalid API key format. Please provide both API key and application key.');
      return;
    }

    console.log(`Fetching weather data at ${new Date().toLocaleTimeString()} (interval: ${refreshInterval / 1000}s)`);
    setLoading(true);
    setError(null);

    const startTime = Date.now();
    try {
      // Make actual API call to Ambient Weather Network
      const response = await fetch(`https://api.ambientweather.net/v1/devices?apiKey=${apiKey}&applicationKey=${applicationKey}`);
      
      const duration = Date.now() - startTime;
      datadog.trackApiCall(
        'https://api.ambientweather.net/v1/devices',
        'GET',
        response.status,
        duration
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
      
      const apiData: AmbientWeatherDevice[] = await response.json();
      
      console.log('Raw API response:', JSON.stringify(apiData, null, 2));
      
      if (!apiData || apiData.length === 0) {
        throw new Error('No weather devices found. Please check your API keys and device configuration.');
      }

      // Use the first device's data
      const device = apiData[0];
      const lastData = device.lastData || {};
      const info = device.info || {};
      
            console.log('Device info:', info);
      console.log('Last data fields:', Object.keys(lastData));
      console.log('Last data values:', lastData);

      // Convert timestamp to Date
      const lastUpdated = new Date(lastData.dateutc || Date.now());

      // Helper function to find soil moisture value from various possible field names
      const getSoilMoisture = (data: Record<string, number | undefined>): number => {
        const possibleFields = ['soilhum1', 'Soil 1', 'soil1', 'soilmoisture1', 'soil_moisture_1'];
        for (const field of possibleFields) {
          if (data[field] !== undefined && data[field] !== null) {
            console.log(`Found soil moisture in field '${field}':`, data[field]);
            return data[field];
          }
        }
        console.log('No soil moisture field found in API response');
        return 0;
      };

      // Helper function to find soil temperature value from various possible field names
      const getSoilTemperature = (data: Record<string, number | undefined>): number => {
        const possibleFields = ['soiltemp1', 'soil_temp_1'];
        for (const field of possibleFields) {
          if (data[field] !== undefined && data[field] !== null) {
            console.log(`Found soil temperature in field '${field}':`, data[field]);
            return data[field];
          }
        }
        console.log('No soil temperature field found in API response');
        return 0;
      };

      const weatherData: WeatherData = {
        temperature: lastData.tempf || 0,
        feelsLike: lastData.feelsLike || lastData.tempf || 0,
        humidity: lastData.humidity || 0,
        windSpeed: lastData.windspeedmph || 0,
        windDirection: lastData.winddir || 0,
        pressure: lastData.baromin || 0,
        dewPoint: lastData.dewPoint || 0,
        uvIndex: lastData.uv || 0,
        solarRadiation: lastData.solarradiation || 0,
        dailyRain: lastData.dailyrainin || 0,
        soilMoisture: getSoilMoisture(lastData),
        soilTemperature: getSoilTemperature(lastData),
        lastUpdated,
        location: {
          name: info.name || 'Weather Station',
          coords: info.coords
        },
        isRealData: true
      };
      
      console.log('Real AWN API data received:', weatherData);
      setData(weatherData);
      
      // Track successful weather data update
      datadog.trackWeatherUpdate('api', true);
      
      // Store this data point in historical data
      const historicalPoint: HistoricalDataPoint = {
        timestamp: lastUpdated.getTime(),
        temperature: weatherData.temperature,
        feelsLike: weatherData.feelsLike,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        windDirection: weatherData.windDirection,
        pressure: weatherData.pressure,
        dewPoint: weatherData.dewPoint,
        uvIndex: weatherData.uvIndex,
        solarRadiation: weatherData.solarRadiation,
        dailyRain: weatherData.dailyRain,
        soilMoisture: weatherData.soilMoisture,
        soilTemperature: weatherData.soilTemperature,
      };
      storeHistoricalData(historicalPoint);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data. Please check your API keys and try again.';
      setError(errorMessage);
      console.error('Weather API error:', err);
      
      // Track failed weather data update
      datadog.trackWeatherUpdate('api', false, errorMessage);
      
      // Track error in Datadog
      if (err instanceof Error) {
        datadog.addError(err, { context: 'weather_api_fetch' });
      }
    } finally {
      setLoading(false);
    }
  }, [combinedApiKey]);

  useEffect(() => {
    if (combinedApiKey) {
      // Clean up any existing duplicate data on first load
      cleanupHistoricalData();
      
      fetchWeatherData();
      const interval = setInterval(fetchWeatherData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [combinedApiKey, refreshInterval, fetchWeatherData]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeatherData
  };
};
