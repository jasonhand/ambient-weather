import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getHistoricalData, HistoricalDataPoint } from '../utils/storage';
import { getCardOrder, saveCardOrder, CardConfig } from '../utils/cardOrder';
import { datadog } from '../utils/datadog';
import { Thermometer, Droplet, Wind, Gauge, Sun, Eye, Leaf, GripVertical } from 'lucide-react';
import WeatherCard from './WeatherCard';
import WeatherDetailModal from './WeatherDetailModal';

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
}

interface WeatherStatsProps {
  data: WeatherData;
  loading: boolean;
}

interface ModalData {
  title: string;
  currentValue: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
      pointBackgroundColor: string;
      pointBorderColor: string;
      pointBorderWidth: number;
      pointRadius: number;
      pointHoverRadius: number;
    }[];
  };
}

const WeatherStats: React.FC<WeatherStatsProps> = ({ data, loading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [cardOrder, setCardOrder] = useState<CardConfig[]>([]);

  useEffect(() => {
    // Load historical data from local storage
    const localData = getHistoricalData();
    setHistoricalData(localData);
    
    // Load card order from local storage
    const order = getCardOrder();
    setCardOrder(order);
  }, [data]); // Reload when new data comes in

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getUVLevel = (index: number) => {
    if (index <= 2) return { level: 'Low', color: 'text-green-400' };
    if (index <= 5) return { level: 'Moderate', color: 'text-yellow-400' };
    if (index <= 7) return { level: 'High', color: 'text-orange-400' };
    if (index <= 10) return { level: 'Very High', color: 'text-red-400' };
    return { level: 'Extreme', color: 'text-purple-400' };
  };

  // Generate mini chart data using historical data
  const generateMiniChart = (field: keyof HistoricalDataPoint, color: string) => {
    const chartData = historicalData
      .filter(point => point[field] !== undefined && point[field] !== null)
      .map(point => ({
        time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: point[field] as number
      }))
      .slice(-12); // Show last 12 data points for mini charts

    // If we have historical data, use it; otherwise fall back to current data
    if (chartData.length > 1) {
      return {
        labels: chartData.map(d => d.time),
        datasets: [{
          data: chartData.map(d => d.value),
          borderColor: color,
          backgroundColor: `${color}20`,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1,
          pointRadius: 2,
          pointHoverRadius: 4,
        }]
      };
    } else {
      // Fallback to current data only
      return {
        labels: ['Current'],
        datasets: [{
          data: [data[field as keyof typeof data] as number],
          borderColor: color,
          backgroundColor: `${color}20`,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }]
      };
    }
  };

  // Generate detailed chart data using historical data
  const generateDetailedChart = (field: keyof HistoricalDataPoint, color: string, label: string) => {
    const chartData = historicalData
      .filter(point => point[field] !== undefined && point[field] !== null)
      .map(point => ({
        time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: point[field] as number
      }))
      .slice(-48); // Show last 48 data points for detailed charts (4 hours worth)

    // If we have historical data, use it; otherwise fall back to current data
    if (chartData.length > 1) {
      return {
        labels: chartData.map(d => d.time),
        datasets: [{
          label,
          data: chartData.map(d => d.value),
          borderColor: color,
          backgroundColor: `${color}20`,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      };
    } else {
      // Fallback to current data only
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return {
        labels: [time],
        datasets: [{
          label,
          data: [data[field as keyof typeof data] as number],
          borderColor: color,
          backgroundColor: `${color}20`,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 10,
        }]
      };
    }
  };

  const openModal = (title: string, currentValue: string, subtitle: string, icon: React.ReactNode, gradient: string, field: keyof HistoricalDataPoint, color: string) => {
    setModalData({
      title,
      currentValue,
      subtitle,
      icon,
      gradient,
      chartData: generateDetailedChart(field, color, title)
    });
    setModalOpen(true);
    datadog.trackModalInteraction('open', title.toLowerCase().replace(/\s+/g, '_'));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(cardOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCardOrder(items);
    saveCardOrder(items);
    
    // Track the reordering action
    datadog.trackUserInteraction('card_reordered', 'weather_stats', {
      from: result.source.index,
      to: result.destination.index,
      card: reorderedItem.title
    });
  };

  const getCardIcon = (cardId: string) => {
    switch (cardId) {
      case 'temperature':
      case 'feelsLike':
      case 'soilTemperature':
        return <Thermometer className="w-6 h-6" />;
      case 'humidity':
      case 'dailyRain':
        return <Droplet className="w-6 h-6" />;
      case 'windSpeed':
      case 'windDirection':
        return <Wind className="w-6 h-6" />;
      case 'pressure':
        return <Gauge className="w-6 h-6" />;
      case 'uvIndex':
      case 'solarRadiation':
        return <Sun className="w-6 h-6" />;
      case 'dewPoint':
        return <Eye className="w-6 h-6" />;
      case 'soilMoisture':
        return <Leaf className="w-6 h-6" />;
      default:
        return <Thermometer className="w-6 h-6" />;
    }
  };

  const getCardValue = (cardId: string) => {
    switch (cardId) {
      case 'temperature':
        return `${Math.round(data.temperature)}°F`;
      case 'feelsLike':
        return `${Math.round(data.feelsLike)}°F`;
      case 'humidity':
        return `${data.humidity.toFixed(1)}%`;
      case 'windSpeed':
        return `${data.windSpeed.toFixed(1)} mph`;
      case 'windDirection':
        return `${getWindDirection(data.windDirection)}`;
      case 'pressure':
        return `${data.pressure.toFixed(2)}`;
      case 'dewPoint':
        return `${data.dewPoint.toFixed(1)}°F`;
      case 'uvIndex':
        return data.uvIndex.toFixed(1);
      case 'solarRadiation':
        return `${data.solarRadiation.toFixed(0)}`;
      case 'dailyRain':
        return `${data.dailyRain.toFixed(2)}"`;
      case 'soilMoisture':
        return `${data.soilMoisture.toFixed(1)}%`;
      case 'soilTemperature':
        return `${data.soilTemperature.toFixed(1)}°F`;
      default:
        return 'N/A';
    }
  };

  const getCardSubtitle = (cardId: string) => {
    switch (cardId) {
      case 'temperature':
        return `Feels like ${Math.round(data.feelsLike)}°F`;
      case 'feelsLike':
        return 'Apparent temperature';
      case 'humidity':
        return 'Relative humidity';
      case 'windSpeed':
        return `${getWindDirection(data.windDirection)} (${data.windDirection.toFixed(0)}°)`;
      case 'windDirection':
        return `${data.windDirection.toFixed(0)}°`;
      case 'pressure':
        return 'inHg';
      case 'dewPoint':
        return 'Moisture level';
      case 'uvIndex':
        return getUVLevel(data.uvIndex).level;
      case 'solarRadiation':
        return 'W/m²';
      case 'dailyRain':
        return 'Precipitation today';
      case 'soilMoisture':
        return `Soil temp: ${data.soilTemperature.toFixed(1)}°F`;
      case 'soilTemperature':
        return 'Ground temperature';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const uvInfo = getUVLevel(data.uvIndex);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="weather-cards" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {cardOrder.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative group ${snapshot.isDragging ? 'z-50' : ''}`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 right-2 z-10 p-1 bg-white/10 hover:bg-white/20 rounded-lg cursor-grab active:cursor-grabbing transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <GripVertical className="w-4 h-4 text-white/70" />
                      </div>
                      <div className={snapshot.isDragging ? 'dragging' : ''}>
                        <WeatherCard
                          title={card.title}
                          value={getCardValue(card.id)}
                          subtitle={getCardSubtitle(card.id)}
                          icon={getCardIcon(card.id)}
                          gradient={card.gradient}
                          subtitleClass={card.id === 'uvIndex' ? getUVLevel(data.uvIndex).color : undefined}
                          chartData={generateMiniChart(card.field as keyof HistoricalDataPoint, card.color)}
                          onClick={() => openModal(
                            card.title,
                            getCardValue(card.id),
                            getCardSubtitle(card.id),
                            getCardIcon(card.id),
                            card.gradient,
                            card.field as keyof HistoricalDataPoint,
                            card.color
                          )}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {modalData && (
        <WeatherDetailModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalData.title}
          currentValue={modalData.currentValue}
          subtitle={modalData.subtitle}
          icon={modalData.icon}
          gradient={modalData.gradient}
          chartData={modalData.chartData}
        />
      )}
    </>
  );
};

export default WeatherStats;
