const axios = require('axios');

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'INTC', name: 'Intel Corporation' },
  { symbol: 'IBM', name: 'International Business Machines' },
  { symbol: 'ORCL', name: 'Oracle Corporation' }
];

const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.STOCK_API_KEY;
    
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data['Global Quote'];
    
    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ message: 'Stock data not found' });
    }

    const quote = {
      symbol: data['01. symbol'],
      price: parseFloat(data['05. price']),
      change: parseFloat(data['09. change']),
      changePercent: data['10. change percent'].replace('%', ''),
      high: parseFloat(data['03. high']),
      low: parseFloat(data['04. low']),
      open: parseFloat(data['02. open']),
      previousClose: parseFloat(data['08. previous close']),
      volume: parseInt(data['06. volume']),
      latestTradingDay: data['07. latest trading day']
    };

    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days = 30 } = req.query;
    const apiKey = process.env.STOCK_API_KEY;
    
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    const response = await axios.get(url);
    const timeSeries = response.data['Time Series (Daily)'];
    
    if (!timeSeries) {
      return res.status(404).json({ message: 'Historical data not found' });
    }

    const dates = Object.keys(timeSeries).slice(0, parseInt(days)).reverse();
    const history = dates.map(date => ({
      date,
      open: parseFloat(timeSeries[date]['1. open']),
      high: parseFloat(timeSeries[date]['2. high']),
      low: parseFloat(timeSeries[date]['3. low']),
      close: parseFloat(timeSeries[date]['4. close']),
      volume: parseInt(timeSeries[date]['5. volume'])
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPopularStocks = async (req, res) => {
  try {
    const apiKey = process.env.STOCK_API_KEY;
    const stocksWithData = [];

    for (const stock of popularStocks) {
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${apiKey}`;
        const response = await axios.get(url);
        const data = response.data['Global Quote'];
        
        if (data && Object.keys(data).length > 0) {
          stocksWithData.push({
            symbol: stock.symbol,
            name: stock.name,
            price: parseFloat(data['05. price']) || 0,
            change: parseFloat(data['09. change']) || 0,
            changePercent: data['10. change percent'] ? data['10. change percent'].replace('%', '') : '0'
          });
        }
      } catch (err) {
        stocksWithData.push({
          symbol: stock.symbol,
          name: stock.name,
          price: 0,
          change: 0,
          changePercent: '0'
        });
      }
    }

    res.json(stocksWithData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.STOCK_API_KEY;
    
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`;
    const response = await axios.get(url);
    const matches = response.data.bestMatches || [];
    
    const results = matches.map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region']
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStockQuote, getStockHistory, getPopularStocks, searchStocks };
