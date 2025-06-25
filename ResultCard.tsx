import React from 'react';

interface ResultItem {
  label: string;
  value: string;
  color: string;
}

interface ResultCardProps {
  title: string;
  data: ResultItem[];
}

const ResultCard: React.FC<ResultCardProps> = ({ title, data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#1C1C1E' }}>
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <span className="text-gray-600 font-medium">{item.label}</span>
            <span className="text-lg font-bold" style={{ color: item.color }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultCard;