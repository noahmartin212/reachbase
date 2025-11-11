import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const Accounts: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <button className="btn-primary flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Account
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <p className="text-gray-500">Account management will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
