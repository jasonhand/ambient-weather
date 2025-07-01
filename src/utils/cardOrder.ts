const CARD_ORDER_STORAGE = 'ambient_weather_card_order';

export interface CardConfig {
  id: string;
  title: string;
  field: string;
  color: string;
  gradient: string;
}

// Default card order and configuration
export const defaultCardOrder: CardConfig[] = [
  { id: 'soilMoisture', title: 'Soil Moisture', field: 'soilMoisture', color: '#10b981', gradient: 'from-green-600 to-emerald-600' },
  { id: 'soilTemperature', title: 'Soil Temperature', field: 'soilTemperature', color: '#059669', gradient: 'from-emerald-600 to-green-700' },
  { id: 'feelsLike', title: 'Feels Like', field: 'feelsLike', color: '#ef4444', gradient: 'from-red-500 to-pink-500' },
  { id: 'temperature', title: 'Temperature', field: 'temperature', color: '#f97316', gradient: 'from-orange-500 to-red-500' },
  { id: 'humidity', title: 'Humidity', field: 'humidity', color: '#06b6d4', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'windSpeed', title: 'Wind Speed', field: 'windSpeed', color: '#6b7280', gradient: 'from-gray-500 to-slate-600' },
  { id: 'windDirection', title: 'Wind Direction', field: 'windDirection', color: '#374151', gradient: 'from-slate-600 to-gray-700' },
  { id: 'pressure', title: 'Pressure', field: 'pressure', color: '#8b5cf6', gradient: 'from-purple-500 to-indigo-500' },
  { id: 'dewPoint', title: 'Dew Point', field: 'dewPoint', color: '#14b8a6', gradient: 'from-teal-500 to-green-500' },
  { id: 'uvIndex', title: 'UV Index', field: 'uvIndex', color: '#eab308', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'solarRadiation', title: 'Solar Radiation', field: 'solarRadiation', color: '#f59e0b', gradient: 'from-amber-500 to-yellow-500' },
  { id: 'dailyRain', title: 'Daily Rain', field: 'dailyRain', color: '#2563eb', gradient: 'from-blue-600 to-blue-800' },
];

export const getCardOrder = (): CardConfig[] => {
  try {
    const stored = localStorage.getItem(CARD_ORDER_STORAGE);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that all default cards are present
      const defaultIds = defaultCardOrder.map(card => card.id);
      const storedIds = parsed.map((card: CardConfig) => card.id);
      
      // If any default cards are missing, add them
      const missingCards = defaultCardOrder.filter(card => !storedIds.includes(card.id));
      const completeOrder = [...parsed, ...missingCards];
      
      return completeOrder;
    }
    return defaultCardOrder;
  } catch (error) {
    console.error('Failed to retrieve card order:', error);
    return defaultCardOrder;
  }
};

export const saveCardOrder = (cardOrder: CardConfig[]): void => {
  try {
    localStorage.setItem(CARD_ORDER_STORAGE, JSON.stringify(cardOrder));
  } catch (error) {
    console.error('Failed to save card order:', error);
  }
};

export const resetCardOrder = (): void => {
  try {
    localStorage.removeItem(CARD_ORDER_STORAGE);
  } catch (error) {
    console.error('Failed to reset card order:', error);
  }
}; 