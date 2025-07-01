
const API_KEY_STORAGE = 'ambient_weather_api_key';

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
