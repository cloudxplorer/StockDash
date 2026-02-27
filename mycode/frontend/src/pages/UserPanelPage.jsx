import { useState, useEffect } from 'react';
import { Heart, TrendingUp, DollarSign, Package, X } from 'lucide-react';
import TransactionTable from '../components/trading/TransactionTable';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserPanelPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateWatchlist } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [watchlistRes, transactionsRes] = await Promise.all([
        api.get('/watchlist'),
        api.get('/transactions/my')
      ]);
      setWatchlist(watchlistRes.data);
      setTransactions(transactionsRes.data);
      setHoldings(user?.holdings || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      await api.delete(`/watchlist/${symbol}`);
      const response = await api.get('/watchlist');
      setWatchlist(response.data);
      updateWatchlist(response.data);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const calculatePortfolioValue = () => {
    return holdings.reduce((total, holding) => total + (holding.quantity * holding.avgPrice), 0);
  };

  const stats = [
    { label: 'Available Balance', value: `$${user?.balance?.toFixed(2) || '0.00'}`, icon: DollarSign },
    { label: 'Portfolio Value', value: `$${calculatePortfolioValue().toFixed(2)}`, icon: TrendingUp },
    { label: 'Total Holdings', value: holdings.length, icon: Package },
    { label: 'Watchlist Items', value: watchlist.length, icon: Heart },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Panel</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your portfolio and track your investments</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            My Watchlist
          </h2>
          {watchlist.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No stocks in watchlist</p>
          ) : (
            <div className="space-y-3">
              {watchlist.map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.symbol}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.name}</p>
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(item.symbol)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-500" />
            My Holdings
          </h2>
          {holdings.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No holdings yet</p>
          ) : (
            <div className="space-y-3">
              {holdings.map((holding) => (
                <div
                  key={holding.symbol}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{holding.symbol}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{holding.quantity} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${(holding.quantity * holding.avgPrice).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Avg: ${holding.avgPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Transaction History</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <TransactionTable transactions={transactions} isAdmin={false} />
        )}
      </div>
    </div>
  );
};

export default UserPanelPage;
