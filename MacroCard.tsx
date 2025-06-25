import React from 'react';
import { Target, Zap, Droplets } from 'lucide-react';

interface MacroCardProps {
  title: string;
  amount: number;
  unit: string;
  calories: number;
  percentage: number;
  color: string;
  icon: 'protein' | 'carbs' | 'fat';
}

const MacroCard: React.FC<MacroCardProps> = ({
  title,
  amount,
  unit,
  calories,
  percentage,
  color,
  icon
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'protein':
        return Target;
      case 'carbs':
        return Zap;
      case 'fat':
        return Droplets;
      default:
        return Target;
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#1C1C1E' }}>
            {title}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{percentage}%</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-bold" style={{ color }}>
            {amount}
          </span>
          <span className="text-gray-500 font-medium">{unit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Calories</span>
          <span className="text-sm font-semibold text-gray-700">{calories}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MacroCard;