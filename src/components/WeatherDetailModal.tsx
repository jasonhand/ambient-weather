
import React from 'react';
import { Line } from 'react-chartjs-2';
import { datadog } from '../utils/datadog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WeatherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentValue: string;
  subtitle: string;
  chartData: {
    labels: string[];
    datasets: {
      label?: string;
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
  icon: React.ReactNode;
  gradient: string;
}

const WeatherDetailModal: React.FC<WeatherDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  currentValue,
  subtitle,
  chartData,
  icon,
  gradient
}) => {
  const handleClose = () => {
    datadog.trackModalInteraction('close', title.toLowerCase().replace(/\s+/g, '_'));
    onClose();
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  // Generate table data from chart data
  const tableData = chartData.labels.map((label, index) => ({
    time: label,
    value: chartData.datasets[0]?.data[index]?.toFixed(2) || 'N/A'
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[85vh] bg-slate-900/95 backdrop-blur-sm border-white/20 text-white flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg`}>
              {icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-lg text-gray-300">Current: {currentValue}</p>
              <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          {/* Chart Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">24-Hour Trend</h3>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Historical Data</h3>
            <div className="max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20 hover:bg-white/5">
                    <TableHead className="text-gray-300">Time</TableHead>
                    <TableHead className="text-gray-300">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.reverse().map((row, index) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-gray-200">{row.time}</TableCell>
                      <TableCell className="text-white font-mono">{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeatherDetailModal;
