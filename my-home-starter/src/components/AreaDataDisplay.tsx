// components/AreaDataDisplay.tsx
import React from 'react';
import type { IntegratedAreaData } from '@/services/integratedAreaService';

interface AreaDataDisplayProps {
  data: IntegratedAreaData;
}

export const AreaDataDisplay: React.FC<AreaDataDisplayProps> = ({ data }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {data.prefecture} {data.city}
      </h2>
      
      {/* 地域統計 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">地域統計</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">人口</p>
            <p className="text-xl font-medium">{data.statistics.population}人</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">世帯数</p>
            <p className="text-xl font-medium">{data.statistics.households}世帯</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">学校数</p>
            <p className="text-xl font-medium">{data.statistics.schools}校</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">{data.statistics.developmentInfo}</p>
          </div>
        </div>
      </div>
      
      {/* 地価情報 */}
      {data.landPrice.hasData && data.landPrice.current && (
        <div>
          <h3 className="text-lg font-semibold mb-2">地価情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">平均地価（㎡）</p>
              <p className="text-xl font-medium">{data.landPrice.current.averagePriceFormatted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">平均坪単価</p>
              <p className="text-xl font-medium">{data.landPrice.current.averageTsuboPriceFormatted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">前年比</p>
              <p className={`text-xl font-medium ${
                data.landPrice.current.changeRate > 0 ? 'text-green-600' : 
                data.landPrice.current.changeRate < 0 ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {data.landPrice.current.changeRate > 0 ? '+' : ''}
                {data.landPrice.current.changeRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">データ年度</p>
              <p className="text-xl font-medium">{data.landPrice.current.dataYear}年</p>
            </div>
          </div>
        </div>
      )}
      
      {!data.landPrice.hasData && (
        <div className="text-gray-500">
          地価データはありません
        </div>
      )}
    </div>
  );
};