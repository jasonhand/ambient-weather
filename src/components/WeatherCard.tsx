
import React from 'react';
import { Line } from 'react-chartjs-2';

interface WeatherCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  subtitleClass?: string;
  chartData?: {
    labels: string[];
    datasets: {
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
  onClick?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  subtitleClass = 'text-gray-300',
  chartData,
  onClick
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      point: { radius: 0 },
      line: { tension: 0.4 },
    },
    interaction: { intersect: false },
  };

  return (
    <div 
      className="relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl" 
           style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>
      
      <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Background Chart */}
        {chartData && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="h-full w-full p-4">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">{title}</h3>
            <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg text-white shadow-lg`}>
              {icon}
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className={`text-sm ${subtitleClass}`}>{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
