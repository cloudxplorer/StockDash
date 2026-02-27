import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Heart, Eye } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StockCard = ({ stock, isInWatchlist, onWatchlistChange }) => {
  const { updateWatchlist } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const isPositive = parseFloat(stock.change) >= 0;
  const changePercent = parseFloat(stock.changePercent).toFixed(2);

  const handleWatchlistToggle = async () => {
    setLoading(true);
    try {
      if (isInWatchlist) {
        await api.delete(`/watchlist/${stock.symbol}`);
      } else {
        await api.post('/watchlist', { symbol: stock.symbol, name: stock.name });
      }
      const response = await api.get('/watchlist');
      updateWatchlist(response.data);
      onWatchlistChange?.();
    } catch (error) {
      console.error('Watchlist error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{stock.symbol}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
        </div>
        <button
          onClick={handleWatchlistToggle}
          disabled={loading}
          className={`p-2 rounded-full transition-colors ${
            isInWatchlist 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${parseFloat(stock.price).toFixed(2)}
          </p>
          <div className={`flex items-center mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span className="font-medium">
              {isPositive ? '+' : ''}{parseFloat(stock.change).toFixed(2)} ({isPositive ? '+' : ''}{changePercent}%)
            </span>
          </div>
        </div>

        <Link
          to={`/stock/${stock.symbol}`}
          className="flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Link>
      </div>
    </div>
  );
};

export default StockCard;
