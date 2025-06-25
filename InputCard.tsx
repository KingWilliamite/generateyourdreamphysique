import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputCardProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  icon: LucideIcon;
  placeholder: string;
  min?: number;
  max?: number;
  step?: number;
}

const InputCard: React.FC<InputCardProps> = ({
  label,
  value,
  onChange,
  unit,
  icon: Icon,
  placeholder,
  min = 0,
  max = 1000,
  step = 1
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#F2F2F7' }}>
          <Icon className="w-5 h-5" style={{ color: '#007AFF' }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: '#1C1C1E' }}>
            {label}
          </h3>
          <p className="text-sm text-gray-500">{unit}</p>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="w-full px-4 py-3 text-lg font-semibold rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all duration-200"
          style={{ backgroundColor: '#FFFFFF' }}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
          {unit}
        </div>
      </div>
      
      {/* Range slider for better UX */}
      <div className="mt-4">
        <input
          type="range"
          value={value || min}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #007AFF 0%, #007AFF ${((value - min) / (max - min)) * 100}%, #E5E7EB ${((value - min) / (max - min)) * 100}%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

export default InputCard;