const API_KEY_STORAGE = 'ambient_weather_api_key';
const HISTORICAL_DATA_STORAGE = 'ambient_weather_historical_data';
const MAX_HISTORICAL_POINTS = 288; // 24 hours worth of 5-minute intervals

export const storeApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
  } catch (error) {
    console.error('Failed to store API key:', error);
  }
};

export const getStoredApiKey = (): string | null => {
  try {
    return localStorage.getItem(API_KEY_STORAGE);
  } catch (error) {
    console.error('Failed to retrieve API key:', error);
    return null;
  }
};

export const removeApiKey = (): void => {
  try {
    localStorage.removeItem(API_KEY_STORAGE);
  } catch (error) {
    console.error('Failed to remove API key:', error);
  }
};

// Historical data storage functions
export interface HistoricalDataPoint {
  timestamp: number;
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
}

export const storeHistoricalData = (dataPoint: HistoricalDataPoint): void => {
  try {
    const existing = getHistoricalData();
    
    // Check if we should store this data point (only if it's been at least 5 minutes since last data point)
    const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (existing.length > 0) {
      const lastDataPoint = existing[existing.length - 1];
      const timeSinceLastData = dataPoint.timestamp - lastDataPoint.timestamp;
      
      // If less than 5 minutes have passed, don't store duplicate data
      if (timeSinceLastData < FIVE_MINUTES_MS) {
        console.log(`Skipping historical data storage - only ${Math.round(timeSinceLastData / 1000)}s since last data point`);
        return;
      }
    }
    
    const updated = [...existing, dataPoint];
    
    // Keep only the most recent MAX_HISTORICAL_POINTS
    if (updated.length > MAX_HISTORICAL_POINTS) {
      updated.splice(0, updated.length - MAX_HISTORICAL_POINTS);
    }
    
    localStorage.setItem(HISTORICAL_DATA_STORAGE, JSON.stringify(updated));
    console.log(`Stored historical data point at ${new Date(dataPoint.timestamp).toLocaleTimeString()}`);
  } catch (error) {
    console.error('Failed to store historical data:', error);
  }
};

export const getHistoricalData = (): HistoricalDataPoint[] => {
  try {
    const data = localStorage.getItem(HISTORICAL_DATA_STORAGE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to retrieve historical data:', error);
    return [];
  }
};

export const clearHistoricalData = (): void => {
  try {
    localStorage.removeItem(HISTORICAL_DATA_STORAGE);
  } catch (error) {
    console.error('Failed to clear historical data:', error);
  }
};

export const cleanupHistoricalData = (): void => {
  try {
    const existing = getHistoricalData();
    if (existing.length === 0) return;
    
    const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
    const cleaned: HistoricalDataPoint[] = [existing[0]]; // Keep the first data point
    
    // Remove duplicates that are less than 5 minutes apart
    for (let i = 1; i < existing.length; i++) {
      const current = existing[i];
      const previous = cleaned[cleaned.length - 1];
      const timeDiff = current.timestamp - previous.timestamp;
      
      if (timeDiff >= FIVE_MINUTES_MS) {
        cleaned.push(current);
      }
    }
    
    if (cleaned.length !== existing.length) {
      console.log(`Cleaned historical data: removed ${existing.length - cleaned.length} duplicate entries`);
      localStorage.setItem(HISTORICAL_DATA_STORAGE, JSON.stringify(cleaned));
    }
  } catch (error) {
    console.error('Failed to cleanup historical data:', error);
  }
};
