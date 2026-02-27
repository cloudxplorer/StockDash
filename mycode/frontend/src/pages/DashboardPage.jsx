import { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign, Activity } from 'lucide-react';
import StockCard from '../components/stock/StockCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stocksRes, watchlistRes] = await Promise.all([
        api.get('/stocks/popular'),
        api.get('/watchlist')
      ]);
      setStocks(stocksRes.data);
      setWatchlist(watchlistRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await api.get(`/stocks/search?query=${query}`);
      setSearchResults(response.data.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const isInWatchlist = (symbol) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  const stats = [
    { label: 'Balance', value: `$${user?.balance?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
    { label: 'Holdings', value: user?.holdings?.length || 0, icon: TrendingUp, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    { label: 'Watchlist', value: watchlist.length, icon: Activity, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search stocks..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
            {searchResults.map((result) => (
              <div
                key={result.symbol}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{result.symbol}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{result.name}</p>
                  </div>
                  <span className="text-xs text-gray-400">{result.region}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Stocks</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                isInWatchlist={isInWatchlist(stock.symbol)}
                onWatchlistChange={fetchData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
