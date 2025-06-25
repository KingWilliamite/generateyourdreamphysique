import React from 'react';
import { Beef, Fish, Zap, Apple } from 'lucide-react';

interface ProteinSource {
  name: string;
  amount: string;
  protein: string;
}

interface ProteinSourceCardProps {
  sources: ProteinSource[];
}

const ProteinSourceCard: React.FC<ProteinSourceCardProps> = ({ sources }) => {
  const getIcon = (name: string) => {
    if (name.toLowerCase().includes('chicken') || name.toLowerCase().includes('steak')) {
      return Beef;
    }
    if (name.toLowerCase().includes('tuna') || name.toLowerCase().includes('fish')) {
      return Fish;
    }
    if (name.toLowerCase().includes('whey') || name.toLowerCase().includes('protein')) {
      return Zap;
    }
    return Apple;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#1C1C1E' }}>
        Protein Source Examples
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        2-6-8-10 Hack: Each provides ~50g protein
      </p>
      
      <div className="space-y-3">
        {sources.map((source, index) => {
          const Icon = getIcon(source.name);
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
              <div className="flex items-center">
                <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#007AFF15' }}>
                  <Icon className="w-4 h-4" style={{ color: '#007AFF' }} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{source.name}</p>
                  <p className="text-sm text-gray-500">{source.protein}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold" style={{ color: '#007AFF' }}>
                  {source.amount}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProteinSourceCard;