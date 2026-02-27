import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Heart, DollarSign, BarChart3, Calendar } from 'lucide-react';
import ChartComponent from '../components/stock/ChartComponent';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StockDetailsPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user, updateWatchlist } = useAuth();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [chartDays, setChartDays] = useState(30);
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  const fetchStockData = async () => {
    try {
      const [quoteRes, watchlistRes] = await Promise.all([
        api.get(`/stocks/quote/${symbol}`),
        api.get('/watchlist')
      ]);
      setStock(quoteRes.data);
      setIsInWatchlist(watchlistRes.data.some(item => item.symbol === symbol));
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = async () => {
    try {
      if (isInWatchlist) {
        await api.delete(`/watchlist/${symbol}`);
      } else {
        await api.post('/watchlist', { symbol, name: stock.symbol });
      }
      const response = await api.get('/watchlist');
      updateWatchlist(response.data);
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Watchlist error:', error);
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    setTradeLoading(true);
    setTradeMessage('');

    try {
      await api.post('/transactions', {
        symbol,
        name: stock.symbol,
        type: tradeType,
        quantity: parseInt(quantity),
        price: stock.price
      });
      setTradeMessage(`Trade request submitted successfully!`);
      setQuantity(1);
    } catch (error) {
      setTradeMessage(error.response?.data?.message || 'Trade failed');
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Stock not found
      </div>
    );
  }

  const isPositive = parseFloat(stock.change) >= 0;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{stock.symbol}</h1>
            <p className="text-gray-600 dark:text-gray-400">{stock.name || symbol}</p>
          </div>
          <button
            onClick={handleWatchlistToggle}
            className={`p-3 rounded-full transition-colors ${
              isInWatchlist
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-6 h-6 ${isInWatchlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Change</p>
            <div className={`flex items-center text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{parseFloat(stock.changePercent).toFixed(2)}%)
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">High / Low</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">${stock.high.toFixed(2)} / ${stock.low.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{(stock.volume / 1000000).toFixed(2)}M</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Price Chart
              </h3>
              <div className="flex space-x-2">
                {[7, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setChartDays(days)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      chartDays === days
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {days}D
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
              <ChartComponent symbol={symbol} days={chartDays} />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Trade
            </h3>

            {tradeMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                tradeMessage.includes('success')
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {tradeMessage}
              </div>
            )}

            <form onSubmit={handleTrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trade Type
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setTradeType('buy')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      tradeType === 'buy'
                        ? 'bg-green-600 text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('sell')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      tradeType === 'sell'
                        ? 'bg-red-600 text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Price per share</span>
                  <span className="font-medium text-gray-900 dark:text-white">${stock.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-primary-600">${(stock.price * quantity).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={tradeLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                  tradeType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {tradeLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${symbol}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailsPage;
