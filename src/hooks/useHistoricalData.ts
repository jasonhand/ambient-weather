import { useState, useEffect, useCallback } from 'react';

interface HistoricalDataPoint {
  dateutc: number;
  tempf?: number;
  humidity?: number;
  baromin?: number;
  windspeedmph?: number;
  soilhum1?: number;
  soiltemp1?: number;
  uv?: number;
  solarradiation?: number;
  dailyrainin?: number;
}

export const useHistoricalData = (combinedApiKey: string, hours: number = 24) => {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = useCallback(async () => {
    if (!combinedApiKey) return;

    // Parse the combined API key (format: "apiKey:applicationKey")
    const [apiKey, applicationKey] = combinedApiKey.split(':');
    
    if (!apiKey || !applicationKey) {
      setError('Invalid API key format. Please provide both API key and application key.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate date range for historical data
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (hours * 60 * 60 * 1000));
      
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();

      // Make API call to get historical data
      const response = await fetch(
        `https://api.ambientweather.net/v1/data?apiKey=${apiKey}&applicationKey=${applicationKey}&startDate=${startDateStr}&endDate=${endDateStr}`
      );
      
      if (!response.ok) {
        throw new Error(`Historical data API request failed with status ${response.status}: ${response.statusText}`);
      }
      
      const apiData: HistoricalDataPoint[] = await response.json();
      
      console.log('Historical API response:', apiData);
      
      if (!apiData || apiData.length === 0) {
        console.log('No historical data found for the specified time range');
        setData([]);
      } else {
        setData(apiData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch historical weather data.';
      setError(errorMessage);
      console.error('Historical weather API error:', err);
    } finally {
      setLoading(false);
    }
  }, [combinedApiKey, hours]);

  useEffect(() => {
    if (combinedApiKey) {
      fetchHistoricalData();
    }
  }, [combinedApiKey, hours, fetchHistoricalData]);

  return {
    data,
    loading,
    error,
    refetch: fetchHistoricalData
  };
}; 