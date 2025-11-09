import React, { useState } from 'react';
import Dashboard from '../components/Dashboard';
import TransactionForm from '../components/TransactionForm';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-transaction'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('add-transaction')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'add-transaction'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add Transaction
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'add-transaction' && (
        <div className="py-8">
          <TransactionForm />
        </div>
      )}
    </div>
  );
};

export default HomePage;


