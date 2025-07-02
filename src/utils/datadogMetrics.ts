// Datadog Custom Metrics API utility
// This service sends custom metrics to Datadog's API endpoint for custom metrics

interface DatadogMetric {
  metric: string;
  points: Array<[number, number]>; // [timestamp, value]
  type: 'gauge' | 'count' | 'rate';
  host?: string;
  tags?: string[];
}

interface DatadogMetricsPayload {
  series: DatadogMetric[];
}

export class DatadogMetricsService {
  private apiKey: string;
  private appKey: string;
  private host: string;
  private enabled: boolean = false;
  private endpoint: string = 'https://api.datadoghq.com/api/v1/series';
  private lastSendTime: number = 0;

  constructor(apiKey: string, appKey: string, host: string = 'weather-app') {
    this.apiKey = apiKey;
    this.appKey = appKey;
    this.host = host;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getLastSendTime(): number {
    return this.lastSendTime;
  }

  private async sendMetrics(metrics: DatadogMetric[]): Promise<void> {
    if (!this.enabled || !this.apiKey || !this.appKey) {
      return;
    }

    const payload: DatadogMetricsPayload = {
      series: metrics
    };

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': this.apiKey,
          'DD-APPLICATION-KEY': this.appKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send metrics to Datadog:', response.status, errorText);
        throw new Error(`Datadog API error: ${response.status} - ${errorText}`);
      }

      console.log(`Successfully sent ${metrics.length} metrics to Datadog`);
      this.lastSendTime = Date.now();
    } catch (error) {
      console.error('Error sending metrics to Datadog:', error);
      throw error;
    }
  }

  async sendWeatherMetrics(weatherData: {
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
    location?: {
      name: string;
      coords?: {
        lat?: number;
        lon?: number;
      };
    };
  }): Promise<void> {
    if (!this.enabled) {
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    const locationName = weatherData.location?.name || 'unknown';
    const lat = weatherData.location?.coords?.lat;
    const lon = weatherData.location?.coords?.lon;

    const baseTags = [
      `location:${locationName}`,
      'source:ambient_weather',
      'app:weather_dashboard'
    ];

    if (lat !== undefined && lon !== undefined) {
      baseTags.push(`lat:${lat}`, `lon:${lon}`);
    }

    const metrics: DatadogMetric[] = [
      {
        metric: 'weather.temperature.fahrenheit',
        points: [[timestamp, weatherData.temperature]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.feels_like.fahrenheit',
        points: [[timestamp, weatherData.feelsLike]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.humidity.percent',
        points: [[timestamp, weatherData.humidity]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.wind_speed.mph',
        points: [[timestamp, weatherData.windSpeed]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.wind_direction.degrees',
        points: [[timestamp, weatherData.windDirection]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.pressure.inhg',
        points: [[timestamp, weatherData.pressure]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.dew_point.fahrenheit',
        points: [[timestamp, weatherData.dewPoint]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.uv_index',
        points: [[timestamp, weatherData.uvIndex]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.solar_radiation.wm2',
        points: [[timestamp, weatherData.solarRadiation]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.daily_rain.inches',
        points: [[timestamp, weatherData.dailyRain]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.soil_moisture.percent',
        points: [[timestamp, weatherData.soilMoisture]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      },
      {
        metric: 'weather.soil_temperature.fahrenheit',
        points: [[timestamp, weatherData.soilTemperature]],
        type: 'gauge',
        host: this.host,
        tags: [...baseTags]
      }
    ];

    await this.sendMetrics(metrics);
  }

  async sendAppMetrics(metricName: string, value: number, tags: string[] = []): Promise<void> {
    if (!this.enabled) {
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const baseTags = [
      'source:ambient_weather',
      'app:weather_dashboard',
      ...tags
    ];

    const metric: DatadogMetric = {
      metric: metricName,
      points: [[timestamp, value]],
      type: 'gauge',
      host: this.host,
      tags: baseTags
    };

    await this.sendMetrics([metric]);
  }
}

// Create a singleton instance
let datadogMetricsInstance: DatadogMetricsService | null = null;

export const getDatadogMetricsService = (): DatadogMetricsService | null => {
  return datadogMetricsInstance;
};

export const initializeDatadogMetrics = (apiKey: string, appKey: string, host?: string): DatadogMetricsService => {
  datadogMetricsInstance = new DatadogMetricsService(apiKey, appKey, host);
  return datadogMetricsInstance;
};

export const destroyDatadogMetrics = (): void => {
  datadogMetricsInstance = null;
}; 