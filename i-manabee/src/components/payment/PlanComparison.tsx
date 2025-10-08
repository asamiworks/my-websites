'use client';

import { PLAN_FEATURES } from '@/data/plans';

export function PlanComparison() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          プラン詳細比較
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                機能
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                無料プラン
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                まなびーキッズ
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 bg-yellow-50">
                まなびーフレンズ
                <div className="text-xs text-yellow-600 font-normal">人気</div>
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                まなびープレミアム
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {PLAN_FEATURES.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.feature}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                  {item.free}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                  {item.kids}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center bg-yellow-50">
                  {item.friends}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                  {item.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="text-green-500 mr-1">✅</span>
            <span>利用可能</span>
          </div>
          <div className="flex items-center">
            <span className="text-red-500 mr-1">❌</span>
            <span>利用不可</span>
          </div>
        </div>
      </div>
    </div>
  );
}