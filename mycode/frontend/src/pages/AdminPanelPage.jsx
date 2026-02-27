import { useState, useEffect } from 'react';
import { Shield, Users, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import TransactionTable from '../components/trading/TransactionTable';
import api from '../services/api';

const AdminPanelPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    approvedTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, usersRes] = await Promise.all([
        api.get('/transactions/all'),
        api.get('/auth/users')
      ]);
      
      setTransactions(transactionsRes.data);
      setUsers(usersRes.data);
      
      setStats({
        totalUsers: usersRes.data.length,
        totalTransactions: transactionsRes.data.length,
        pendingTransactions: transactionsRes.data.filter(t => t.status === 'pending').length,
        approvedTransactions: transactionsRes.data.filter(t => t.status === 'approved').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/transactions/${id}/approve`);
      fetchData();
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/transactions/${id}/reject`);
      fetchData();
    } catch (error) {
      console.error('Error rejecting transaction:', error);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    { label: 'Total Transactions', value: stats.totalTransactions, icon: TrendingUp, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
    { label: 'Pending', value: stats.pendingTransactions, icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' },
    { label: 'Approved', value: stats.approvedTransactions, icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-primary-600" />
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Manage users, transactions, and system settings</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Users
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === 'transactions' ? (
            <TransactionTable
              transactions={transactions}
              isAdmin={true}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Balance</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Holdings</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Watchlist</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900 dark:text-white">
                        ${user.balance.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900 dark:text-white">
                        {user.holdings.length}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900 dark:text-white">
                        {user.watchlist.length}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
