import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchTransactionStats } from '../store/slices/transactionSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, statsLoading, error } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactionStats({ months: 12 }));
  }, [dispatch]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  const getAdviceColor = (advice: string) => {
    if (advice.includes('Excellent')) return 'text-green-600';
    if (advice.includes('Good balance')) return 'text-blue-600';
    if (advice.includes('quite high')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Dashboard</h1>
        
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Needs</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${stats.totalNeeds.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Wants</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${stats.totalWants.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Needs Percentage</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.needsPercentage.toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Wants Percentage</h3>
            <p className="text-2xl font-bold text-orange-600">
              {stats.wantsPercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Visual Breakdown - Simple Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Needs vs Wants Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Needs</span>
                <span className="text-sm text-gray-500">${stats.totalNeeds.toFixed(2)} ({stats.needsPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${stats.needsPercentage}%` }}
                >
                  {stats.needsPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Wants</span>
                <span className="text-sm text-gray-500">${stats.totalWants.toFixed(2)} ({stats.wantsPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-purple-600 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${stats.wantsPercentage}%` }}
                >
                  {stats.wantsPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Advice */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Advice</h2>
          <p className={`text-lg ${getAdviceColor(stats.financialAdvice)}`}>
            {stats.financialAdvice}
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Target:</strong> 70% Needs, 30% Wants for optimal financial health
            </p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Needs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Needs %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.monthlyData.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {month.month} {month.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${month.needs.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${month.wants.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${month.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {month.needsPercentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;