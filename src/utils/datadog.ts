// Datadog RUM utility functions
export const datadog = {
  // Check if Datadog RUM is available
  isAvailable: (): boolean => {
    return typeof window !== 'undefined' && window.DD_RUM !== undefined;
  },

  // Add a custom action
  addAction: (name: string, attributes?: Record<string, unknown>): void => {
    if (datadog.isAvailable()) {
      window.DD_RUM.addAction(name, attributes);
    }
  },

  // Add an error
  addError: (error: Error, attributes?: Record<string, unknown>): void => {
    if (datadog.isAvailable()) {
      window.DD_RUM.addError(error, attributes);
    }
  },

  // Add custom timing
  addTiming: (name: string, time?: number): void => {
    if (datadog.isAvailable()) {
      window.DD_RUM.addTiming(name, time);
    }
  },

  // Set user information
  setUser: (user: { id?: string; name?: string; email?: string; [key: string]: unknown }): void => {
    if (datadog.isAvailable()) {
      window.DD_RUM.setUser(user);
    }
  },

  // Set custom attribute
  setAttribute: (key: string, value: unknown): void => {
    if (datadog.isAvailable()) {
      window.DD_RUM.setAttribute(key, value);
    }
  },

  // Remove custom attribute
  removeAttribute: (key: string): void => {
    if (datadog.isAvailable()) {
      window.DD_RUM.removeAttribute(key);
    }
  },

  // Track API calls
  trackApiCall: (url: string, method: string, status: number, duration: number): void => {
    datadog.addAction('api_call', {
      url,
      method,
      status,
      duration,
    });
  },

  // Track weather data updates
  trackWeatherUpdate: (dataSource: 'api' | 'mock', success: boolean, error?: string): void => {
    datadog.addAction('weather_data_update', {
      data_source: dataSource,
      success,
      error,
    });
  },

  // Track user interactions
  trackUserInteraction: (action: string, target: string, value?: unknown): void => {
    datadog.addAction('user_interaction', {
      action,
      target,
      value,
    });
  },

  // Track chart interactions
  trackChartInteraction: (chartType: string, metric: string): void => {
    datadog.addAction('chart_interaction', {
      chart_type: chartType,
      metric,
    });
  },

  // Track modal interactions
  trackModalInteraction: (action: 'open' | 'close', modalType: string): void => {
    datadog.addAction('modal_interaction', {
      action,
      modal_type: modalType,
    });
  },
}; 